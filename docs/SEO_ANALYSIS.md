# 🔍 SEO Analysis — Nhãn Việt E-Commerce

## Executive Summary

Your project is a **Vite + React SPA** (Single Page Application) that renders everything client-side. This is the **single biggest SEO blocker** — search engines see an empty `<div id="root"></div>` with no content. Below is a prioritized breakdown of all issues and how to fix them.

---

## 🚨 Critical Issues (Must Fix)

### 1. SPA Architecture — No Server-Side Rendering

> [!CAUTION]
> This is the #1 reason your site will rank poorly. Google's crawler sees an **empty HTML page**. All content is rendered via JavaScript *after* the page loads.

**What crawlers see today:**
```html
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>website bán nhãn - tuanNV</title>
  </head>
  <body>
    <div id="root"></div>  <!-- EMPTY! All content is invisible to crawlers -->
  </body>
</html>
```

**How to fix — two options:**

| Option | Effort | SEO Benefit | Best For |
|--------|--------|-------------|----------|
| **Migrate to Next.js** (App Router) | High | ★★★★★ | Long-term production site |
| **Add `vite-plugin-ssr` or Vike** | Medium | ★★★★☆ | Keep Vite, add SSR/SSG |

> [!TIP]
> Since your repo is called `nextjs-web-ban-hang`, it seems you **intended** to use Next.js. Migrating to Next.js App Router would give you SSR, automatic routing, built-in `<head>` management via `metadata` exports, and image optimization — all critical for SEO.

---

### 2. No Real Routing — Everything is State-Based

**Current approach** in [App.tsx](file:///d:/ForFun/nextjs-web-ban-hang/src/app/App.tsx#L28):
```tsx
const [currentPage, setCurrentPage] = useState('home');
// ...
{currentPage === 'home' && ( ... )}
{currentPage === 'farm' && ( ... )}
{currentPage === 'contact' && ( ... )}
```

**Problems:**
- ❌ All pages share the **same URL** (`/`) — crawlers can't discover individual pages
- ❌ No back/forward browser history
- ❌ Can't bookmark or share specific pages
- ❌ Crawlers can never index your Contact, Farm, Account pages separately

**How to fix:**
You already have `react-router` v7 installed. Use it:

```tsx
// With react-router
<BrowserRouter>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/nhan-tuoi" element={<FreshLonganPage />} />
    <Route path="/nhan-say" element={<DriedLonganPage />} />
    <Route path="/vuon-nhan" element={<FarmPage />} />
    <Route path="/lien-he" element={<ContactPage />} />
  </Routes>
</BrowserRouter>
```

> [!IMPORTANT]
> Use **Vietnamese SEO-friendly slugs** in URLs: `/nhan-tuoi`, `/nhan-say`, `/lien-he` rather than `/fresh`, `/dried`, `/contact`. This helps with Vietnamese keyword ranking.

---

### 3. Missing Meta Tags — Title, Description, Open Graph

**Current state** in [index.html](file:///d:/ForFun/nextjs-web-ban-hang/index.html):
```html
<title>website bán nhãn - tuanNV</title>
<!-- No meta description -->
<!-- No Open Graph tags -->
<!-- No canonical URL -->
```

**Problems:**
- ❌ Generic, non-descriptive title
- ❌ No `<meta name="description">` — Google will auto-generate one (usually badly)
- ❌ No Open Graph / Twitter cards — links shared on social media look plain
- ❌ No `<link rel="canonical">` — risk of duplicate content issues
- ❌ No favicon specified

**Recommended `<head>` for the homepage:**

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Primary SEO -->
  <title>Nhãn Việt — Nhãn Lồng Tươi & Nhãn Sấy Tự Nhiên | Giao Hàng Toàn Quốc</title>
  <meta name="description" content="Chuyên cung cấp nhãn lồng tươi Hưng Yên, nhãn sấy dẻo tự nhiên. Cùi dày, hạt nhỏ, ngọt thanh. Miễn phí giao hàng cho đơn từ 499.000đ." />
  <meta name="keywords" content="nhãn lồng, nhãn tươi, nhãn sấy, nhãn Hưng Yên, mua nhãn online, nhãn lồng tươi" />
  <link rel="canonical" href="https://nhanviet.vn/" />
  
  <!-- Open Graph (Facebook/Zalo) -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Nhãn Việt — Nhãn Lồng Tươi & Nhãn Sấy Tự Nhiên" />
  <meta property="og:description" content="Chuyên cung cấp nhãn lồng tươi và nhãn sấy từ vườn nhãn chất lượng. Giao hàng toàn quốc." />
  <meta property="og:image" content="https://nhanviet.vn/og-image.jpg" />
  <meta property="og:url" content="https://nhanviet.vn/" />
  <meta property="og:locale" content="vi_VN" />
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</head>
```

> [!NOTE]
> Each page (Contact, Farm, etc.) needs its **own unique title and description**. With the SPA approach this requires `react-helmet-async` or similar. With Next.js, it's built-in via `metadata` exports.

---

## ⚠️ High Priority Issues

### 4. Heading Hierarchy is Broken

**Current heading structure on the home page:**

```
<h1> "Nhãn Việt"              (inside header logo — line 233)
<h2> "Chuyên nhãn lồng..."    (hero section — line 394)
<h3> "Sản phẩm nổi bật"       (featured products — line 445)
<h3> "Nhãn lồng tươi..."      (fresh section — line 464)
<h3> "Nhãn sấy dẻo thơm"     (dried section — line 524)
<h3> "Ưu đãi dành cho..."     (promo — line 547)
<h4> headings in footer
```

**Problems:**
- The `<h1>` is "Nhãn Việt" (brand name) — not descriptive of page content
- Hero has `<h2>` which should be the `<h1>` on a homepage
- Multiple `<h3>`s are section titles but lack keyword richness

**Recommended structure:**
```
<h1> "Nhãn lồng tươi & Nhãn sấy tự nhiên — Giao hàng toàn quốc"  (ONE per page)
  <h2> "Sản phẩm nổi bật"
    <h3> Product names
  <h2> "Nhãn lồng tươi từ vườn Hưng Yên"
    <h3> Product names
  <h2> "Nhãn sấy dẻo thơm"
    <h3> Product names
```

> [!IMPORTANT]
> There must be exactly **one `<h1>` per page**, and it should contain your primary target keyword.

---

### 5. No Structured Data (Schema.org / JSON-LD)

Search engines use structured data to display **rich results** (star ratings, prices, availability) directly in search results.

**You need to add JSON-LD for:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Nhãn lồng tươi loại 1 - 1kg",
  "description": "Cùi dày, hạt nhỏ, ngọt thanh",
  "image": "https://nhanviet.vn/images/nhan-tuoi-1kg.jpg",
  "offers": {
    "@type": "Offer",
    "price": "69000",
    "priceCurrency": "VND",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "reviewCount": "42"
  }
}
</script>
```

**Also add:**
- `LocalBusiness` schema for the Contact page (address, phone, hours)
- `BreadcrumbList` for navigation
- `FAQPage` schema for the FAQ section in [ContactPage.tsx](file:///d:/ForFun/nextjs-web-ban-hang/src/app/components/ContactPage.tsx#L255-L289)
- `Organization` schema for the brand

---

### 6. Images Lack SEO Optimization

**Current issues in** [ProductCard.tsx](file:///d:/ForFun/nextjs-web-ban-hang/src/app/components/ProductCard.tsx#L34-L38) **and** [App.tsx](file:///d:/ForFun/nextjs-web-ban-hang/src/app/App.tsx#L431-L435):

```tsx
// Generic alt text
<img src="https://images.unsplash.com/photo-1755971103481..." alt="Nhãn lồng tươi" />

// Product card: alt = product name (this is OK!)
<img src={image} alt={name} />
```

**Problems:**
- ❌ Using **external Unsplash URLs** — no control over loading speed, no CDN optimization
- ❌ No `width` / `height` attributes → layout shift (hurts Core Web Vitals)
- ❌ No lazy loading for below-the-fold images
- ❌ No `srcset` or responsive images
- ❌ Gallery images have generic alts: `"Vườn nhãn 1"`, `"Vườn nhãn 2"` — not descriptive

**How to fix:**
```tsx
<img
  src="/images/nhan-tuoi-1kg.webp"
  alt="Nhãn lồng tươi loại 1 - quả to, cùi dày, hạt nhỏ"
  width={500}
  height={500}
  loading="lazy"
  decoding="async"
/>
```

---

## 📋 Medium Priority Issues

### 7. No `lang="vi"` on HTML Tag

[index.html](file:///d:/ForFun/nextjs-web-ban-hang/index.html#L3) has `lang="en"` but the entire site is in Vietnamese.

```diff
-<html lang="en">
+<html lang="vi">
```

### 8. Navigation Uses `<button>` Instead of `<a>` Links

In [App.tsx](file:///d:/ForFun/nextjs-web-ban-hang/src/app/App.tsx#L239-L282), navigation items are `<button>` elements:
```tsx
<button onClick={() => navigateToPage('home')}>Trang chủ</button>
```

**Problem:** Crawlers follow `<a href>` links to discover pages. Buttons with JS click handlers are **invisible** to crawlers.

**Fix:** Use `<a>` tags (or `<Link>` from react-router):
```tsx
<Link to="/">Trang chủ</Link>
<Link to="/nhan-tuoi">Nhãn tươi</Link>
```

### 9. Footer Links Use `href="#"`

In [App.tsx](file:///d:/ForFun/nextjs-web-ban-hang/src/app/App.tsx#L607-L612):
```tsx
<a href="#" className="hover:text-[#43A047]">Chính sách giao hàng</a>
```

These are **dead links** — they don't go anywhere and waste crawl budget. Either create real pages or remove them.

### 10. No Sitemap or Robots.txt

- ❌ Missing `/sitemap.xml` — crawlers can't discover all pages efficiently
- ❌ Missing `/robots.txt` — no crawl directives

---

## 📊 Full Issue Summary

| # | Issue | Severity | SEO Impact | Effort |
|---|-------|----------|------------|--------|
| 1 | No SSR — empty HTML for crawlers | 🔴 Critical | ★★★★★ | High |
| 2 | No URL routing — all pages at `/` | 🔴 Critical | ★★★★★ | Medium |
| 3 | Missing meta tags (title, desc, OG) | 🔴 Critical | ★★★★☆ | Low |
| 4 | Broken heading hierarchy | 🟡 High | ★★★☆☆ | Low |
| 5 | No structured data (JSON-LD) | 🟡 High | ★★★★☆ | Medium |
| 6 | Unoptimized images | 🟡 High | ★★★☆☆ | Medium |
| 7 | Wrong `lang` attribute | 🟢 Medium | ★★☆☆☆ | Trivial |
| 8 | Nav uses buttons, not links | 🟢 Medium | ★★★☆☆ | Low |
| 9 | Dead footer links (`href="#"`) | 🟢 Medium | ★★☆☆☆ | Low |
| 10 | No sitemap / robots.txt | 🟢 Medium | ★★★☆☆ | Low |

---

## 🎯 Recommended Action Plan

### Phase 1 — Quick Wins (1-2 days)
1. Change `lang="en"` → `lang="vi"` in `index.html`
2. Add proper `<title>`, `<meta description>`, and OG tags to `index.html`
3. Fix heading hierarchy (`<h1>` should be page-specific)
4. Add `width`, `height`, and `loading="lazy"` to all `<img>` tags

### Phase 2 — Routing & Navigation (3-5 days)
1. Implement `react-router` with proper URL paths
2. Replace all `<button onClick>` navigation with `<Link to>` components
3. Add `react-helmet-async` for per-page `<title>` and meta tags
4. Fix or create real pages for footer policy links

### Phase 3 — Architecture Migration (1-2 weeks)
1. **Migrate from Vite SPA to Next.js App Router** for server-side rendering
2. Use Next.js `metadata` API for per-page SEO
3. Use `next/image` for automatic image optimization
4. Add `sitemap.xml` generation and `robots.txt`
5. Implement JSON-LD structured data for products, business info, and FAQs

> [!TIP]
> If you want, I can help implement any of these phases — just let me know which one to start with!
