---
name: coding-standards
description: Baseline coding conventions for this Next.js 14+ commerce project (selling fresh nhãn lồng / longan fruit). Covers naming, readability, immutability, TS, React, App Router API routes, and code-quality review.
origin: custom
---

# Coding Standards & Best Practices

Baseline coding conventions for this Next.js 14+ App Router commerce project.

This skill is the shared floor, not the detailed framework playbook.

- Use `frontend-patterns` for React, hooks, state, forms, and UI architecture.
- Use `security-review` before merging anything that handles user input, secrets, or payments.
- Use `documentation-lookup` (Context7) for current Next.js / library API behavior.

## When to Activate

- Starting a new project or module
- Reviewing code for quality and maintainability
- Refactoring existing code to follow conventions
- Enforcing naming, formatting, or structural consistency
- Setting up linting, formatting, or type-checking rules
- Onboarding new contributors to coding conventions

## Scope Boundaries

Activate this skill for:
- descriptive naming
- immutability defaults
- readability, KISS, DRY, and YAGNI enforcement
- error-handling expectations and code-smell review

Do not use this skill as the primary source for:
- React composition, hooks, or rendering patterns
- backend architecture, API design, or database layering
- domain-specific framework guidance when a narrower ECC skill already exists

## Code Quality Principles

### 1. Readability First
- Code is read more than written
- Clear variable and function names
- Self-documenting code preferred over comments
- Consistent formatting

### 2. KISS (Keep It Simple, Stupid)
- Simplest solution that works
- Avoid over-engineering
- No premature optimization
- Easy to understand > clever code

### 3. DRY (Don't Repeat Yourself)
- Extract common logic into functions
- Create reusable components
- Share utilities across modules
- Avoid copy-paste programming

### 4. YAGNI (You Aren't Gonna Need It)
- Don't build features before they're needed
- Avoid speculative generality
- Add complexity only when required
- Start simple, refactor when needed

## TypeScript/JavaScript Standards

### Variable Naming

```typescript
// PASS: GOOD: Descriptive names
const productSearchQuery = 'nhãn lồng'
const isUserAuthenticated = true
const cartTotalVnd = 250_000

// FAIL: BAD: Unclear names
const q = 'nhãn lồng'
const flag = true
const x = 250000
```

### Function Naming

```typescript
// PASS: GOOD: Verb-noun pattern
async function fetchProductBySlug(slug: string) { }
function calculateCartTotal(items: CartItem[]): number { }
function isValidPhone(phone: string): boolean { }

// FAIL: BAD: Unclear or noun-only
async function product(slug: string) { }
function total(items) { }
function phone(p) { }
```

### Immutability Pattern (CRITICAL)

```typescript
// PASS: ALWAYS use spread operator
const updatedUser = {
  ...user,
  name: 'New Name'
}

const updatedArray = [...items, newItem]

// FAIL: NEVER mutate directly
user.name = 'New Name'  // BAD
items.push(newItem)     // BAD
```

### Error Handling

```typescript
// PASS: GOOD: Comprehensive error handling
async function fetchData(url: string) {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Fetch failed:', error)
    throw new Error('Failed to fetch data')
  }
}

// FAIL: BAD: No error handling
async function fetchData(url) {
  const response = await fetch(url)
  return response.json()
}
```

### Async/Await Best Practices

```typescript
// PASS: GOOD: Parallel execution when possible
const [products, categories, banners] = await Promise.all([
  fetchProducts(),
  fetchCategories(),
  fetchBanners()
])

// FAIL: BAD: Sequential when unnecessary
const products = await fetchProducts()
const categories = await fetchCategories()
const banners = await fetchBanners()
```

### Type Safety

```typescript
// PASS: GOOD: Proper types
interface Product {
  id: string
  slug: string
  name: string
  priceVnd: number
  status: 'in_stock' | 'preorder' | 'sold_out'
  createdAt: Date
}

function getProduct(slug: string): Promise<Product> {
  // Implementation
}

// FAIL: BAD: Using 'any'
function getProduct(slug: any): Promise<any> {
  // Implementation
}
```

## React Best Practices

### Component Structure

```typescript
// PASS: GOOD: Functional component with types
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary'
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  )
}

// FAIL: BAD: No types, unclear structure
export function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>
}
```

### Custom Hooks

```typescript
// PASS: GOOD: Reusable custom hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// Usage
const debouncedQuery = useDebounce(searchQuery, 500)
```

### State Management

```typescript
// PASS: GOOD: Proper state updates
const [count, setCount] = useState(0)

// Functional update for state based on previous state
setCount(prev => prev + 1)

// FAIL: BAD: Direct state reference
setCount(count + 1)  // Can be stale in async scenarios
```

### Conditional Rendering

```typescript
// PASS: GOOD: Clear conditional rendering
{isLoading && <Spinner />}
{error && <ErrorMessage error={error} />}
{data && <DataDisplay data={data} />}

// FAIL: BAD: Ternary hell
{isLoading ? <Spinner /> : error ? <ErrorMessage error={error} /> : data ? <DataDisplay data={data} /> : null}
```

## API Design Standards

### REST API Conventions (Next.js App Router route handlers)

```
GET    /api/products             # List products
GET    /api/products/:slug       # Get specific product
POST   /api/orders               # Create new order
PATCH  /api/orders/:id           # Update order status
DELETE /api/cart/items/:id       # Remove item from cart

# Query parameters for filtering
GET /api/products?category=longan&inStock=true&limit=12&offset=0
```

### Response Format

```typescript
// PASS: GOOD: Consistent response structure
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}

// app/api/products/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    data: products,
    meta: { total: 100, page: 1, limit: 12 }
  })
}

// Error response
return NextResponse.json({
  success: false,
  error: 'Invalid request'
}, { status: 400 })
```

### Input Validation

```typescript
import { z } from 'zod'
import { NextResponse } from 'next/server'

// PASS: GOOD: Schema validation
const CreateOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1).max(100)
  })).min(1),
  shippingAddress: z.object({
    fullName: z.string().min(1).max(120),
    phone: z.string().regex(/^(0|\+84)\d{9}$/, 'Số điện thoại không hợp lệ'),
    province: z.string().min(1),
    district: z.string().min(1),
    addressLine: z.string().min(1).max(200)
  }),
  note: z.string().max(500).optional()
})

export async function POST(request: Request) {
  const body = await request.json()

  const parsed = CreateOrderSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({
      success: false,
      error: 'Validation failed',
      details: parsed.error.flatten()
    }, { status: 400 })
  }

  // Proceed with parsed.data
}
```

## File Organization

### Project Structure (target Next.js App Router layout)

The repo currently has a Vite SPA structure under `src/app/components/`. Target Next.js layout (per `docs/NEXTJS_MIGRATION_PLAN.md`):

```
src/
├── app/                       # Next.js App Router
│   ├── api/                  # Route handlers
│   ├── products/[slug]/      # Product detail
│   ├── gio-hang/             # Cart page
│   ├── tai-khoan/            # Account
│   ├── don-hang/             # Orders
│   ├── lien-he/              # Contact
│   ├── nong-trai/            # Farm
│   ├── layout.tsx
│   ├── page.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/                # React components
│   ├── ui/                   # shadcn/ui primitives
│   ├── product/              # ProductCard, ProductDetailPage
│   ├── cart/                 # CartModal
│   └── layout/               # Header, Footer, FloatingContactButtons
├── hooks/                    # Custom React hooks
├── lib/                      # Utilities and configs
│   ├── api/                 # Server-side data access
│   ├── utils/               # Helper functions (formatCurrencyVnd, etc.)
│   └── constants/           # Constants
├── types/                    # TypeScript types
└── styles/                   # Global styles + Tailwind theme
```

### File Naming

```
components/ProductCard.tsx     # PascalCase for components
hooks/useCart.ts              # camelCase with 'use' prefix
lib/formatCurrencyVnd.ts      # camelCase for utilities
types/product.types.ts        # camelCase with .types suffix
app/products/[slug]/page.tsx  # lowercase, Next.js conventions
```

## Comments & Documentation

### When to Comment

```typescript
// PASS: GOOD: Explain WHY, not WHAT
// Use exponential backoff to avoid overwhelming the API during outages
const delay = Math.min(1000 * Math.pow(2, retryCount), 30000)

// Deliberately using mutation here for performance with large arrays
items.push(newItem)

// FAIL: BAD: Stating the obvious
// Increment counter by 1
count++

// Set name to user's name
name = user.name
```

### JSDoc for Public APIs

```typescript
/**
 * Searches products by name, category, or tag.
 *
 * @param query - Natural language search query (Vietnamese supported)
 * @param limit - Maximum number of results (default: 12)
 * @returns Array of products sorted by relevance
 *
 * @example
 * ```typescript
 * const results = await searchProducts('nhãn lồng Hưng Yên', 6)
 * console.log(results[0].name) // "Nhãn lồng Hưng Yên loại 1"
 * ```
 */
export async function searchProducts(
  query: string,
  limit: number = 12
): Promise<Product[]> {
  // Implementation
}
```

## Performance Best Practices

### Memoization

```typescript
import { useMemo, useCallback } from 'react'

// PASS: GOOD: Memoize expensive computations
const sortedProducts = useMemo(() => {
  return [...products].sort((a, b) => a.priceVnd - b.priceVnd)
}, [products])

// PASS: GOOD: Memoize callbacks
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])
```

### Server vs Client Components (App Router)

```typescript
// PASS: Default to Server Components. No 'use client' needed.
// app/products/page.tsx
export default async function ProductsPage() {
  const products = await getProducts() // server-side
  return <ProductGrid products={products} />
}

// PASS: Only mark client when you actually need interactivity / browser APIs
// components/cart/CartModal.tsx
'use client'
import { useState } from 'react'
export function CartModal() { /* ... */ }
```

### Lazy Loading & Code Splitting

```typescript
// PASS: next/dynamic for heavy client-only components
import dynamic from 'next/dynamic'

const ProductGallery = dynamic(() => import('./ProductGallery'), {
  loading: () => <GallerySkeleton />,
  ssr: false // disable SSR if the component depends on window/DOM
})
```

### Images

```typescript
// PASS: Use next/image — automatic optimization, AVIF/WebP, lazy loading
import Image from 'next/image'

<Image
  src={product.imageUrl}
  alt={product.name}
  width={600}
  height={600}
  sizes="(max-width: 640px) 100vw, 50vw"
  priority={isAboveTheFold}
/>
```

## Testing Standards

### Test Structure (AAA Pattern)

```typescript
test('calculateCartTotal sums item prices with quantity', () => {
  // Arrange
  const items = [
    { productId: 'p1', priceVnd: 50_000, quantity: 2 },
    { productId: 'p2', priceVnd: 30_000, quantity: 1 }
  ]

  // Act
  const total = calculateCartTotal(items)

  // Assert
  expect(total).toBe(130_000)
})
```

### Test Naming

```typescript
// PASS: GOOD: Descriptive test names
test('returns empty array when no products match query', () => { })
test('rejects order with invalid Vietnamese phone format', () => { })
test('applies free-shipping when subtotal >= 500k VND', () => { })

// FAIL: BAD: Vague test names
test('works', () => { })
test('test search', () => { })
```

## Code Smell Detection

Watch for these anti-patterns:

### 1. Long Functions
```typescript
// FAIL: BAD: Function > 50 lines
function processOrder() {
  // 100 lines of code
}

// PASS: GOOD: Split into smaller functions
function processOrder(input: unknown) {
  const validated = validateOrder(input)
  const priced = applyDiscounts(validated)
  return persistOrder(priced)
}
```

### 2. Deep Nesting
```typescript
// FAIL: BAD: 5+ levels of nesting
if (user) {
  if (user.isAdmin) {
    if (product) {
      if (product.inStock) {
        if (hasPermission) {
          // Do something
        }
      }
    }
  }
}

// PASS: GOOD: Early returns
if (!user) return
if (!user.isAdmin) return
if (!product) return
if (!product.inStock) return
if (!hasPermission) return

// Do something
```

### 3. Magic Numbers
```typescript
// FAIL: BAD: Unexplained numbers
if (retryCount > 3) { }
setTimeout(callback, 500)

// PASS: GOOD: Named constants
const MAX_RETRIES = 3
const DEBOUNCE_DELAY_MS = 500

if (retryCount > MAX_RETRIES) { }
setTimeout(callback, DEBOUNCE_DELAY_MS)
```

**Remember**: Code quality is not negotiable. Clear, maintainable code enables rapid development and confident refactoring.
