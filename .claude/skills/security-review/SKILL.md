---
name: security-review
description: Security checklist for this Next.js commerce site. Use when adding auth, handling user input, exposing API routes, writing route handlers, or handling order/payment data.
origin: custom
---

# Security Review Skill

This skill ensures all code follows security best practices and identifies potential vulnerabilities, oriented around Next.js App Router and a commerce site (cart/orders/customer PII).

## When to Activate

- Implementing authentication or authorization
- Handling user input or file uploads
- Creating new API endpoints
- Working with secrets or credentials
- Implementing payment features
- Storing or transmitting sensitive data
- Integrating third-party APIs

## Security Checklist

### 1. Secrets Management

#### FAIL: NEVER Do This
```typescript
const dbPassword = "password123" // In source code
const sepayToken = "secret_xxx"  // Hardcoded payment provider key
```

#### PASS: ALWAYS Do This
```typescript
// Server-only: never NEXT_PUBLIC_*
const dbUrl = process.env.DATABASE_URL
const paymentApiKey = process.env.PAYMENT_API_KEY

if (!dbUrl) {
  throw new Error('DATABASE_URL not configured')
}
```

#### `NEXT_PUBLIC_*` Pitfall

Any env var prefixed with `NEXT_PUBLIC_` is inlined into the **client bundle** at build time and is therefore public. Never put secrets behind that prefix.

```typescript
// PASS: safe to expose
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

// FAIL: this token will end up in the browser bundle
const adminToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN
```

#### Verification Steps
- [ ] No hardcoded API keys, tokens, or passwords
- [ ] All secrets in environment variables (server-only — no `NEXT_PUBLIC_` prefix on secrets)
- [ ] `.env`, `.env.local`, `.env.*.local` in `.gitignore`
- [ ] No secrets in git history (`git log -p | grep -i 'key\|token\|secret'`)
- [ ] Production secrets configured in hosting platform (Vercel, etc.)

### 2. Input Validation

#### Always Validate User Input
```typescript
import { z } from 'zod'
import { NextResponse } from 'next/server'

// Define validation schema (typical commerce order)
const CreateOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1).max(100)
  })).min(1),
  shippingAddress: z.object({
    fullName: z.string().min(1).max(120),
    phone: z.string().regex(/^(0|\+84)\d{9}$/),
    province: z.string().min(1),
    district: z.string().min(1),
    addressLine: z.string().min(1).max(200)
  }),
  note: z.string().max(500).optional()
})

// app/api/orders/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  const parsed = CreateOrderSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    )
  }
  // Re-price on the server — NEVER trust prices from the client
  const order = await createOrder(parsed.data)
  return NextResponse.json({ success: true, data: order })
}
```

#### Price Tampering — Always Re-price Server-Side

The cart on the client carries prices for display only. On checkout, fetch authoritative prices from the database and ignore any price field sent in the request body.

```typescript
// FAIL: Trusting client price
const total = body.items.reduce((s, i) => s + i.price * i.quantity, 0)

// PASS: Re-price from DB
const productIds = parsed.data.items.map(i => i.productId)
const products = await db.product.findMany({ where: { id: { in: productIds } } })
const priceById = new Map(products.map(p => [p.id, p.priceVnd]))
const total = parsed.data.items.reduce(
  (s, i) => s + (priceById.get(i.productId) ?? 0) * i.quantity,
  0
)
```

#### File Upload Validation
```typescript
function validateFileUpload(file: File) {
  // Size check (5MB max)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File too large (max 5MB)')
  }

  // Type check
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type')
  }

  // Extension check
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0]
  if (!extension || !allowedExtensions.includes(extension)) {
    throw new Error('Invalid file extension')
  }

  return true
}
```

#### Verification Steps
- [ ] All user inputs validated with Zod (or equivalent) schemas
- [ ] File uploads restricted (size, type, extension)
- [ ] No direct use of user input in queries
- [ ] Whitelist validation (not blacklist)
- [ ] Order prices re-derived on the server, never trusted from client
- [ ] Error messages don't leak sensitive info

### 3. SQL Injection Prevention

#### FAIL: NEVER Concatenate SQL
```typescript
// DANGEROUS - SQL Injection vulnerability
const query = `SELECT * FROM products WHERE slug = '${userSlug}'`
await db.$queryRawUnsafe(query)
```

#### PASS: ALWAYS Use Parameterized Queries / ORM
```typescript
// Prisma (safe by default)
const product = await db.product.findUnique({ where: { slug: userSlug } })

// Or with Prisma raw + parameter binding
await db.$queryRaw`SELECT * FROM products WHERE slug = ${userSlug}`

// Raw pg with placeholders
await pool.query('SELECT * FROM products WHERE slug = $1', [userSlug])
```

#### Verification Steps
- [ ] All database queries use parameterized queries / ORM
- [ ] No string concatenation in SQL
- [ ] No use of `$queryRawUnsafe` / `$executeRawUnsafe` with user input

### 4. Authentication & Authorization

#### Session / JWT Handling (Next.js)
```typescript
// FAIL: WRONG: localStorage (vulnerable to XSS)
localStorage.setItem('token', token)

// PASS: CORRECT: httpOnly cookies via next/headers
import { cookies } from 'next/headers'

cookies().set('session', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax', // 'strict' if no third-party redirects needed
  path: '/',
  maxAge: 60 * 60 * 24 * 7 // 7 days
})
```

#### IDOR / Ownership Checks on Orders

Every order/account endpoint must verify the authenticated user owns the resource — do not trust IDs from the URL.

```typescript
// app/api/orders/[id]/route.ts
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const order = await db.order.findUnique({ where: { id: params.id } })
  if (!order || order.userId !== user.id) {
    // Same response for "not found" and "not yours" to avoid enumeration
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: order })
}
```

#### Authorization Checks
```typescript
export async function deleteOrder(orderId: string, requesterId: string) {
  const requester = await db.user.findUnique({ where: { id: requesterId } })
  if (requester?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  await db.order.delete({ where: { id: orderId } })
}
```

#### Middleware Protection (App Router)

```typescript
// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value
  if (!session) {
    const url = new URL('/dang-nhap', req.url)
    url.searchParams.set('next', req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ['/tai-khoan/:path*', '/don-hang/:path*', '/api/orders/:path*']
}
```

#### Verification Steps
- [ ] Tokens stored in httpOnly cookies (not localStorage)
- [ ] Authorization + ownership checks before sensitive operations
- [ ] `middleware.ts` protects private routes
- [ ] Role-based access control implemented
- [ ] Session management secure

### 5. XSS Prevention

#### Sanitize HTML
```typescript
import DOMPurify from 'isomorphic-dompurify'

// ALWAYS sanitize user-provided HTML
function renderUserContent(html: string) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
    ALLOWED_ATTR: []
  })
  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}
```

#### Content Security Policy (next.config.js)
```typescript
// next.config.mjs
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  font-src 'self' data:;
  connect-src 'self' https://*.supabase.co https://*.sepay.vn;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`.replace(/\s{2,}/g, ' ').trim()

const securityHeaders = [
  { key: 'Content-Security-Policy', value: cspHeader },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }
]

export default {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  }
}
```

Adjust `connect-src` to match the payment/analytics providers you actually use.

#### Verification Steps
- [ ] User-provided HTML sanitized
- [ ] CSP headers configured
- [ ] No unvalidated dynamic content rendering
- [ ] React's built-in XSS protection used

### 6. CSRF Protection

#### CSRF Tokens
```typescript
import { csrf } from '@/lib/csrf'

export async function POST(request: Request) {
  const token = request.headers.get('X-CSRF-Token')

  if (!csrf.verify(token)) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    )
  }

  // Process request
}
```

#### SameSite Cookies
```typescript
res.setHeader('Set-Cookie',
  `session=${sessionId}; HttpOnly; Secure; SameSite=Strict`)
```

#### Verification Steps
- [ ] CSRF tokens on state-changing operations
- [ ] SameSite=Strict on all cookies
- [ ] Double-submit cookie pattern implemented

### 7. Rate Limiting

Next.js App Router route handlers run on serverless functions — `express-rate-limit` won't work. Use an edge/serverless-compatible store such as Upstash Redis.

```typescript
// lib/rateLimit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const orderLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 orders/min/IP
  analytics: true
})

// app/api/orders/route.ts
import { headers } from 'next/headers'
import { orderLimiter } from '@/lib/rateLimit'

export async function POST(request: Request) {
  const ip = headers().get('x-forwarded-for')?.split(',')[0] ?? 'anon'
  const { success } = await orderLimiter.limit(ip)
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }
  // ...
}
```

#### Verification Steps
- [ ] Rate limiting on order creation, login, OTP, and search endpoints
- [ ] Stricter limits on expensive / write operations
- [ ] IP-based rate limiting (read forwarded headers, not raw socket IP on serverless)
- [ ] User-based rate limiting once authenticated

### 8. Sensitive Data Exposure

#### Logging
```typescript
// FAIL: WRONG: Logging sensitive data
console.log('User login:', { email, password })
console.log('Payment:', { cardNumber, cvv })

// PASS: CORRECT: Redact sensitive data
console.log('User login:', { email, userId })
console.log('Payment:', { last4: card.last4, userId })
```

#### Error Messages
```typescript
// FAIL: WRONG: Exposing internal details
catch (error) {
  return NextResponse.json(
    { error: error.message, stack: error.stack },
    { status: 500 }
  )
}

// PASS: CORRECT: Generic error messages
catch (error) {
  console.error('Internal error:', error)
  return NextResponse.json(
    { error: 'An error occurred. Please try again.' },
    { status: 500 }
  )
}
```

#### Verification Steps
- [ ] No passwords, tokens, or secrets in logs
- [ ] Error messages generic for users
- [ ] Detailed errors only in server logs
- [ ] No stack traces exposed to users

### 9. Payment Webhooks (Sepay / VietQR / MoMo / VNPay)

If you accept online payments, payment-provider webhooks must:

- Verify the request signature using the provider's shared secret before trusting any field.
- Be idempotent — the same `transaction_id` must not double-credit an order.
- Re-fetch the order from your DB and re-compare amount, currency, and status against the provider's payload. Never mark an order paid because the request "looked right."

```typescript
// app/api/webhooks/sepay/route.ts
import crypto from 'node:crypto'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const raw = await request.text()
  const signature = request.headers.get('x-sepay-signature') ?? ''
  const expected = crypto
    .createHmac('sha256', process.env.SEPAY_WEBHOOK_SECRET!)
    .update(raw)
    .digest('hex')

  // Constant-time comparison to avoid timing attacks
  const valid =
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  if (!valid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(raw)
  // Idempotency: short-circuit if we've already processed this transaction
  const already = await db.payment.findUnique({ where: { externalId: payload.transactionId } })
  if (already) return NextResponse.json({ ok: true })

  // Re-verify amount/currency against the order before marking paid
  const order = await db.order.findUnique({ where: { id: payload.orderId } })
  if (!order || order.totalVnd !== payload.amount || payload.currency !== 'VND') {
    return NextResponse.json({ error: 'Order mismatch' }, { status: 422 })
  }

  await db.$transaction([
    db.payment.create({ data: { externalId: payload.transactionId, orderId: order.id, amount: payload.amount } }),
    db.order.update({ where: { id: order.id }, data: { status: 'paid' } })
  ])

  return NextResponse.json({ ok: true })
}
```

#### Verification Steps
- [ ] Webhook signature verified with `timingSafeEqual`
- [ ] Idempotent processing (one `transactionId` → one credit)
- [ ] Amount + currency re-checked against the DB
- [ ] No payment provider secrets behind `NEXT_PUBLIC_*`
- [ ] PII (phone, address) in webhook bodies kept out of logs

### 10. Dependency Security

#### Regular Updates
```bash
# Check for vulnerabilities
npm audit

# Fix automatically fixable issues
npm audit fix

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

#### Lock Files
```bash
# ALWAYS commit lock files
git add package-lock.json

# Use in CI/CD for reproducible builds
npm ci  # Instead of npm install
```

#### Verification Steps
- [ ] Dependencies up to date
- [ ] No known vulnerabilities (npm audit clean)
- [ ] Lock files committed
- [ ] Dependabot enabled on GitHub
- [ ] Regular security updates

## Security Testing

### Automated Security Tests
```typescript
// Test authentication
test('requires authentication', async () => {
  const response = await fetch('/api/protected')
  expect(response.status).toBe(401)
})

// Test authorization
test('requires admin role', async () => {
  const response = await fetch('/api/admin', {
    headers: { Authorization: `Bearer ${userToken}` }
  })
  expect(response.status).toBe(403)
})

// Test input validation
test('rejects invalid input', async () => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ email: 'not-an-email' })
  })
  expect(response.status).toBe(400)
})

// Test rate limiting
test('enforces rate limits', async () => {
  const requests = Array(101).fill(null).map(() =>
    fetch('/api/endpoint')
  )

  const responses = await Promise.all(requests)
  const tooManyRequests = responses.filter(r => r.status === 429)

  expect(tooManyRequests.length).toBeGreaterThan(0)
})
```

## Pre-Deployment Security Checklist

Before ANY production deployment:

- [ ] **Secrets**: No hardcoded secrets, all in env vars
- [ ] **Input Validation**: All user inputs validated
- [ ] **SQL Injection**: All queries parameterized
- [ ] **XSS**: User content sanitized
- [ ] **CSRF**: Protection enabled
- [ ] **Authentication**: Proper token handling
- [ ] **Authorization**: Role checks in place
- [ ] **Rate Limiting**: Enabled on all endpoints
- [ ] **HTTPS**: Enforced in production
- [ ] **Security Headers**: CSP, X-Frame-Options configured
- [ ] **Error Handling**: No sensitive data in errors
- [ ] **Logging**: No sensitive data logged
- [ ] **Dependencies**: Up to date, no vulnerabilities
- [ ] **CORS**: Properly configured (only allow trusted origins on API routes)
- [ ] **File Uploads**: Validated (size, type, extension)
- [ ] **Payment Webhooks**: Signature verified + idempotent + amount re-checked
- [ ] **PII**: Customer phone/address never logged

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Headers](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)
- [Web Security Academy](https://portswigger.net/web-security)

---

**Remember**: Security is not optional. One vulnerability can compromise the entire platform. When in doubt, err on the side of caution.
