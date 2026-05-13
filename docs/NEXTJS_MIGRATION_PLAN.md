# Next.js Migration Plan — Nhãn Việt

> Status: revision 2 (2026-05-13). Replaces the earlier 5-week plan after auditing the current codebase against its claims. Scope trimmed to what is actually required to ship an SEO-correct production site.

---

## 1. Current state (verified against the repo)

The repo is a **Vite + React 18 SPA** despite being named `nextjs-web-ban-hang`. Single `App.tsx` (~900 lines) holds the home page, all product data, and a state-based pseudo-router.

### 1.1. What is actually wrong

| Issue | Evidence | Severity |
|---|---|---|
| All "pages" share URL `/` | `src/app/App.tsx:31` `useState('home')`; conditional renders at lines 615, 805, 815, 821, 827 | Critical |
| No SSR — crawlers see empty shell | `index.html:12` `<div id="root"></div>`; pure CSR via `src/main.tsx` | Critical |
| Per-route metadata missing | `react-helmet-async` is wired (`App.tsx:374-437`) but contains a single static block reused for every "page" | Critical |
| No sitemap.xml / robots.txt | Not present in repo | High |
| Footer dead links `href="#"` | `src/app/App.tsx:860-863` | Medium |
| `index.html` has `lang="en"` for a Vietnamese site | `index.html:3` (Helmet later sets `vi`, so it is only wrong pre-hydration) | Medium |
| Product data hardcoded in `App.tsx` | Lines 129-369 — three inline arrays, no slugs | Refactor |
| Hot-linked Unsplash images everywhere | All `<img src="https://images.unsplash.com/...">` | Perf |
| Dependency bloat | `@mui/material`, `@emotion/*`, `react-slick`, `embla-carousel-react`, `react-dnd*`, `react-responsive-masonry`, `vaul`, `react-popper`, `next-themes`, `canvas-confetti`, `react-day-picker`, `react-helmet-async`, `react-router` (installed, never imported) | Cleanup |

### 1.2. What the original plan got wrong (so we don't repeat it)

- Claimed "no structured data" — `Organization` and `LocalBusiness` JSON-LD are already in `App.tsx:397-436`. They just need to move into the Next.js root layout.
- Claimed `<h2>` on home hero — it is actually `<h1>` (`App.tsx:622`).
- Listed only React/Radix/Tailwind in deps — missed the ~15 unused libraries above.
- Reinstalls Tailwind v3/v4 from scratch — the repo is already on Tailwind v4 (`@tailwindcss/vite 4.1.12`), so the migration step is "swap the Vite plugin for the PostCSS plugin", not a fresh install.
- Did not mention the `figma-asset-resolver` Vite plugin (`vite.config.ts:7-17`) that resolves `figma:asset/*` imports. No code currently uses that protocol, so the plugin can simply be dropped — but it must be dropped explicitly.
- Recommended NextAuth/Clerk, Sentry, Vercel Analytics, FB Pixel, Zustand, ISR — all out of scope for the current MVP, which has no real auth, no backend, and hardcoded data.

### 1.3. What is already good

- JSON-LD for Organization + LocalBusiness exists, just lives in the wrong place.
- Headings are mostly correct (`h1` on home hero and product detail; `h2` on sections; `h3` on cards).
- `aria-*` attributes and semantic landmarks (`<nav>`, `<address>`, `<article>`) are in place.
- Tailwind v4 + Radix UI primitives are already configured.

---

## 2. Target architecture (Next.js 14+ App Router)

### 2.1. Route map

| Current state | New URL | Render strategy |
|---|---|---|
| `home` | `/` | SSG |
| `product-detail` | `/san-pham/[slug]` | SSG (`generateStaticParams`) |
| — | `/san-pham/nhan-tuoi` | SSG (filtered listing) |
| — | `/san-pham/nhan-say` | SSG (filtered listing) |
| `contact` | `/lien-he` | SSG |
| `account` | `/tai-khoan` | Client island |
| `orders` | `/tai-khoan/don-hang` | Client island |
| (cart) | Modal, no route | — |

Vietnamese slugs are deliberate — they help rank for Vietnamese queries.

### 2.2. File layout

```
src/
├── app/
│   ├── layout.tsx                  # Root layout, global metadata, JSON-LD, Header/Footer
│   ├── page.tsx                    # Home (server component)
│   ├── globals.css                 # Imports theme.css
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── not-found.tsx
│   ├── san-pham/
│   │   ├── nhan-tuoi/page.tsx
│   │   ├── nhan-say/page.tsx
│   │   └── [slug]/page.tsx
│   ├── lien-he/page.tsx
│   └── tai-khoan/
│       ├── page.tsx
│       └── don-hang/page.tsx
├── components/
│   ├── layout/                     # Header, Footer, FloatingContactButtons
│   ├── home/                       # HeroSection, FeaturedProducts, FreshSection, DriedSection, PromotionBanner
│   ├── products/                   # ProductCard, ProductGrid, ProductDetail, RelatedProducts
│   ├── cart/                       # CartProvider, CartModal, CartButton
│   ├── auth/                       # LoginModal, UserMenu (mock for now)
│   ├── seo/                        # JsonLd helpers (Product, Breadcrumb)
│   └── ui/                         # shadcn primitives (kept)
├── lib/
│   ├── data/products.ts            # Product type + data + queries
│   ├── design-tokens.ts            # (already exists)
│   └── utils.ts                    # (already exists)
└── styles/
    └── theme.css                   # (already exists)
public/
├── images/products/                # Downloaded from Unsplash
├── og/                             # OG images per route
└── favicon.svg
```

---

## 3. Migration phases

Total estimate for one developer: **5-7 working days**.

### Phase 0 — Pre-migration cleanup (½ day)

Do this in the current Vite repo first. It is reversible and gives a cleaner base no matter what.

1. **Extract product data.** Move the three inline arrays out of `App.tsx:129-369` into `src/lib/data/products.ts`:
   ```ts
   export interface ProductVariant { id: string; name: string; price: number; oldPrice?: number; stock: number; }
   export interface Product {
     id: string; slug: string; name: string; description: string;
     price: number; oldPrice?: number; unit: string;
     image: string; images?: string[];
     category: 'fresh' | 'dried' | 'combo';
     badge?: string; rating: number;
     fullDescription?: string; origin?: string; harvest?: string; packaging?: string;
     variants?: ProductVariant[];
     featured?: boolean;
   }
   export const products: Product[] = [ /* ... */ ];
   export const getProducts = (filters?: { category?: Product['category']; featured?: boolean }) => /* ... */;
   export const getProductBySlug = (slug: string) => products.find(p => p.slug === slug);
   export const getAllProductSlugs = () => products.map(p => p.slug);
   ```
   Each product needs a stable slug (e.g. `nhan-long-tuoi-loai-1`, `combo-nhan-tuoi-nhan-say`).

2. **Audit and remove unused deps.** Grep the source for imports first, then drop everything that has no consumer:
   - Almost certainly droppable: `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`, `react-slick`, `embla-carousel-react`, `react-dnd`, `react-dnd-html5-backend`, `react-responsive-masonry`, `vaul`, `react-popper`, `@popperjs/core`, `next-themes`, `canvas-confetti`, `react-day-picker`, `react-helmet-async` (will be replaced by Next metadata), `react-router` (never used).
   - Keep: Radix primitives that `src/app/components/ui/*` actually uses, `lucide-react`, `motion`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, `cmdk`, `input-otp`, `react-hook-form`, `sonner`, `recharts`, `date-fns` (only if a component uses them — verify with grep).

3. **Drop the figma asset resolver.** No code uses `figma:asset/`, so the plugin and the convention go away with the Vite config.

### Phase 1 — Scaffold Next.js in place (1 day)

The current Vite scaffolding is shallow enough that an in-place migration is cleaner than starting a sibling project.

1. **Delete** `index.html`, `vite.config.ts`, `src/main.tsx`.
2. **`package.json`:**
   ```jsonc
   {
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "start": "next start",
       "lint": "next lint"
     },
     "dependencies": {
       "next": "^14.2.0",
       "react": "18.3.1",
       "react-dom": "18.3.1",
       /* keep the trimmed list from Phase 0 */
     },
     "devDependencies": {
       "@types/node": "^20",
       "@types/react": "^18",
       "@types/react-dom": "^18",
       "typescript": "^5",
       "tailwindcss": "^4.1.12",
       "@tailwindcss/postcss": "^4.1.12",
       "postcss": "^8",
       "autoprefixer": "^10",
       "eslint": "^8",
       "eslint-config-next": "^14.2.0"
     }
   }
   ```
3. **`next.config.mjs`:**
   ```js
   /** @type {import('next').NextConfig} */
   export default {
     reactStrictMode: true,
     poweredByHeader: false,
     images: {
       formats: ['image/avif', 'image/webp'],
       remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
     },
   };
   ```
   Once images are downloaded locally in Phase 5, the `remotePatterns` entry can be removed.
4. **`postcss.config.mjs`** (Tailwind v4 PostCSS):
   ```js
   export default { plugins: { '@tailwindcss/postcss': {} } };
   ```
5. **`tsconfig.json`** — Next.js's defaults with `"paths": { "@/*": ["./src/*"] }`.
6. **Move `src/main.tsx` boot logic into `app/layout.tsx`.** Drop `react-helmet-async`; everything in the existing `<Helmet>` block becomes either `metadata` export or a JSON-LD `<script>` rendered inside the `<body>`.

### Phase 2 — Pages and routing (1-2 days)

For each route, split the current monolith:

1. **`app/layout.tsx`** (server component) — owns:
   - `<html lang="vi">`, `<body>`
   - `export const metadata: Metadata` with title template, description, default OG, robots, `metadataBase`
   - Organization + LocalBusiness JSON-LD (lifted from `App.tsx:397-436`)
   - `<Header />`, `{children}`, `<Footer />`, `<FloatingContactButtons />`
   - `<CartProvider>` wrapping children (client island)

2. **`app/page.tsx`** (server component) — composes:
   - `<HeroSection />`
   - `<FeaturedProducts products={getProducts({ featured: true })} />`
   - `<FreshSection products={getProducts({ category: 'fresh' })} />`
   - `<DriedSection products={getProducts({ category: 'dried' })} />`
   - `<PromotionBanner />`
   Per-page `metadata` overrides title/description.

3. **`app/san-pham/[slug]/page.tsx`:**
   ```tsx
   export async function generateStaticParams() {
     return getAllProductSlugs().map(slug => ({ slug }));
   }
   export async function generateMetadata({ params }): Promise<Metadata> {
     const p = getProductBySlug(params.slug);
     if (!p) return {};
     return {
       title: p.name,
       description: p.description,
       openGraph: { title: p.name, description: p.description, images: [p.image] },
     };
   }
   export default function Page({ params }) {
     const product = getProductBySlug(params.slug);
     if (!product) notFound();
     const related = getProducts({ category: product.category }).filter(r => r.id !== product.id);
     return <ProductDetail product={product} related={related} />;
   }
   ```
   `ProductDetail` is mostly the existing `ProductDetailPage.tsx`, minus the `onBack` prop (use Next's back link or breadcrumb), with the variant/quantity state in a `'use client'` child.

4. **`app/san-pham/nhan-tuoi/page.tsx`** and **`/nhan-say/page.tsx`** — server components rendering `<ProductGrid products={getProducts({ category: 'fresh' | 'dried' })} />`, each with route-specific `metadata`.

5. **`app/lien-he/page.tsx`** — split `ContactPage.tsx` into a server-rendered shell (`<ContactInfo />`) and a `'use client'` form (`<ContactForm />`). Form submission stays client-only for now (no API route).

6. **`app/tai-khoan/page.tsx` + `/don-hang/page.tsx`** — `'use client'` pages reading from the (still mock) auth context. Real auth is out of scope; keep current behavior.

7. **Replace every state-based navigation with `<Link>`:**
   - `App.tsx:453` logo `<button onClick={navigateToPage('home')}>` → `<Link href="/">`
   - `App.tsx:467-507` nav items → `<Link href="/" | "/san-pham/nhan-tuoi" | "/san-pham/nhan-say" | "/lien-he">`
   - `App.tsx:540, 549` user menu items → `<Link href="/tai-khoan" | "/tai-khoan/don-hang">`
   - `ProductCard` `onClick={onClick}` → wrap in `<Link href={`/san-pham/${slug}`}>` (use `<Link>` around the card, with the Add-to-Cart button using `e.preventDefault()` + `e.stopPropagation()`).
   - Footer dead `href="#"` links (`App.tsx:860-863`) — either remove or create stub pages.

### Phase 3 — Client state (½ day)

Cart is the only piece of real client state. Skip Zustand.

```tsx
// src/components/cart/CartProvider.tsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext<{...} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  // hydrate from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem('cart');
    if (raw) setItems(JSON.parse(raw));
  }, []);
  // persist
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(items)); }, [items]);
  // addItem, removeItem, updateQuantity, clear
  return <CartContext.Provider value={...}>{children}</CartContext.Provider>;
}
export const useCart = () => { const c = useContext(CartContext); if (!c) throw new Error('CartProvider missing'); return c; };
```

LoginModal stays mock-only (current `useState<{name, email}>`). When real auth is added later, replace with NextAuth/Auth.js — not now.

### Phase 4 — SEO surfaces (1 day)

1. **`app/sitemap.ts`:**
   ```ts
   import { MetadataRoute } from 'next';
   import { products } from '@/lib/data/products';

   export default function sitemap(): MetadataRoute.Sitemap {
     const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nhanviet.vn';
     const staticRoutes = ['', '/san-pham/nhan-tuoi', '/san-pham/nhan-say', '/lien-he'];
     return [
       ...staticRoutes.map(r => ({ url: `${base}${r}`, lastModified: new Date(), priority: r === '' ? 1 : 0.8 })),
       ...products.map(p => ({ url: `${base}/san-pham/${p.slug}`, lastModified: new Date(), priority: 0.7 })),
     ];
   }
   ```

2. **`app/robots.ts`:**
   ```ts
   export default function robots(): MetadataRoute.Robots {
     const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nhanviet.vn';
     return {
       rules: [{ userAgent: '*', allow: '/', disallow: ['/tai-khoan/'] }],
       sitemap: `${base}/sitemap.xml`,
     };
   }
   ```

3. **Per-route metadata.** Every `page.tsx` exports its own `metadata` (or `generateMetadata` for dynamic routes). Use the title template from the root layout (`%s | Nhãn Việt`).

4. **JSON-LD helpers** in `src/components/seo/`:
   - `OrganizationJsonLd` and `LocalBusinessJsonLd` — rendered once in `app/layout.tsx`.
   - `ProductJsonLd` — rendered inside `app/san-pham/[slug]/page.tsx`. Include `aggregateRating`, `offers.priceCurrency: "VND"`, `offers.availability`.
   - `BreadcrumbJsonLd` — rendered on detail and listing pages.

5. **`<html lang="vi">`** — set on the `<html>` element in `app/layout.tsx`.

6. **Fix the 4 dead footer links** (`App.tsx:860-863`). Either create stub `/chinh-sach/*` pages with placeholder copy or remove the links until the policies exist. Dead links waste crawl budget.

### Phase 5 — Images and performance (½ day)

1. **Download Unsplash images** to `public/images/products/` (rename per slug, e.g. `nhan-long-tuoi-loai-1.webp`). Update `products.ts` to reference local paths. Then drop the `remotePatterns` entry from `next.config.mjs`. This eliminates a third-party dependency for LCP-critical assets.
2. **Replace every `<img>` with `next/image`** (`ProductCard.tsx:54`, `ProductDetailPage.tsx:98,123,454`, `App.tsx:660` hero, etc.):
   ```tsx
   <Image
     src={image} alt={`${name} - ${description}`}
     width={500} height={500}
     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
     priority={isAboveFold}
   />
   ```
3. **Fonts.** Use `next/font/google` with `Inter` (or whatever the design tokens specify). Make sure the Vietnamese subset is included:
   ```ts
   const inter = Inter({ subsets: ['vietnamese', 'latin'], display: 'swap' });
   ```
4. **OG images.** Add one PNG/JPG per route under `public/og/` (home, fresh, dried, contact). Reference them in each page's `metadata.openGraph.images`.

### Phase 6 — Verification (½ day)

1. `pnpm build && pnpm start`.
2. **View Source** on `/`, `/san-pham/[slug]`, `/san-pham/nhan-tuoi`, `/lien-he`. Every title, meta description, H1, product name, and price must be in the static HTML — not added by JS.
3. **Lighthouse** (mobile + desktop) on the same routes. Targets:
   - LCP < 2.5s, CLS < 0.1, INP < 200ms
   - SEO ≥ 95, Accessibility ≥ 90
4. **Rich Results Test** (https://search.google.com/test/rich-results) on a product URL — confirm Product + Offer + AggregateRating are recognized.
5. **Sitemap** at `/sitemap.xml` resolves and contains every product slug. **Robots** at `/robots.txt`.
6. **Cart smoke test**: add items on home → navigate to detail → refresh → cart still has the items.
7. **404**: visit `/san-pham/does-not-exist`; should render `not-found.tsx`.

---

## 4. SEO checklist (final state)

- [x] One H1 per page, with primary keyword
- [x] Unique `<title>` and `<meta description>` per route (Next.js `metadata`)
- [x] Open Graph + Twitter card per route with route-specific image
- [x] `<html lang="vi">`
- [x] Canonical URLs (Next.js sets them via `metadataBase`)
- [x] `sitemap.xml` and `robots.txt`
- [x] Organization, LocalBusiness, Product, Breadcrumb JSON-LD
- [x] All internal navigation via `<Link href>` (crawlable `<a>` tags)
- [x] Footer policy links resolve (not `href="#"`)
- [x] `next/image` everywhere with `width`/`height`/`sizes`/`alt`
- [x] Vietnamese URL slugs (`/san-pham/nhan-tuoi`, etc.)

---

## 5. Deployment

**Vercel** is the path of least resistance for a Next.js app: zero-config, automatic preview deploys on every branch, free tier covers this traffic profile. Connect the GitHub repo, set `NEXT_PUBLIC_SITE_URL` in project settings, point the production domain at `cname.vercel-dns.com`.

Alternatives (Netlify, self-hosted on a VPS with PM2) are documented in plenty of Next.js guides; for an MVP of this size they buy nothing over Vercel.

**Environment variables (production):**

```
NEXT_PUBLIC_SITE_URL=https://nhanviet.vn
NEXT_PUBLIC_PHONE=0866918366
NEXT_PUBLIC_EMAIL=cskh@nhanviet.vn
```

Add analytics/email/auth env vars only when the corresponding feature lands.

---

## 6. Explicitly out of scope (v1)

These were in the previous plan and have been **removed** as premature:

- NextAuth/Clerk integration — current login is `useState`; no backend to authenticate against. Defer until there is one.
- `app/api/contact/route.ts` with Zod — keep the contact form client-only until an email provider (Resend, SendGrid) is chosen.
- Sentry, Vercel Analytics, Speed Insights, GA4, Facebook Pixel — add post-launch once there is real traffic.
- Zustand — `useState` + Context + `localStorage` is enough for one cart.
- ISR / `revalidate` — product data is hardcoded; SSG is sufficient.
- Database (Supabase, Prisma, PlanetScale) — no persistent data needed yet.
- Sharp, `optimizeCss`, custom image CDN — Next.js defaults handle this.

When any of these become real requirements, treat them as separate, sized initiatives.

---

## 7. Risks and rollback

- **Risk:** Tailwind v4 + Next.js 14 PostCSS setup occasionally has version mismatches. Pin `tailwindcss` and `@tailwindcss/postcss` to the same minor.
- **Risk:** Hot-linked Unsplash URLs may rate-limit during build of `next/image`. Mitigation: Phase 5 downloads them locally; until then keep `remotePatterns`.
- **Risk:** Existing JSON-LD references `https://nhanviet.vn/logo.png`, which does not exist. Add a real logo to `public/` before going live.
- **Rollback:** Work on a `migrate/nextjs` branch. The current `main` keeps the Vite build deployable. If migration stalls, the Vite SPA still runs unchanged.

---

## 8. Suggested commit slicing

For easy review, land each phase as its own PR:

1. `chore: extract products to lib/data, prune unused deps` (Phase 0)
2. `feat: scaffold Next.js, drop Vite` (Phase 1)
3. `feat: migrate routes to App Router with Vietnamese slugs` (Phase 2)
4. `feat: cart provider with localStorage` (Phase 3)
5. `feat: sitemap, robots, per-route metadata, JSON-LD` (Phase 4)
6. `perf: local images and next/image migration` (Phase 5)
7. `chore: production polish, OG images, fonts` (Phase 6)
