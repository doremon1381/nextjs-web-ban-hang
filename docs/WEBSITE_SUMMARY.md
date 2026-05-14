---
version: 2.0.0
updated: 2026-05-14
status: active
---

# Tóm tắt Website Nhãn Việt

---

## 🌐 Tổng quan

**Website:** Nhãn Việt — E-commerce bán nhãn lồng tươi & nhãn sấy
**Mục đích:** Giới thiệu và bán sản phẩm nhãn tươi, nhãn sấy online
**Ngôn ngữ:** Tiếng Việt (có dấu)
**Trạng thái:** ✅ Đã migrate sang Next.js 14 App Router; auth Supabase + admin surface đã hoạt động. Backend nghiệp vụ (ASP.NET) đang ở giai đoạn thiết kế.

---

## 🛠️ Công nghệ

- **Framework:** Next.js 14 App Router (React 18.3.1 + TypeScript 5)
- **Auth & DB:** Supabase (`@supabase/ssr` + `@supabase/supabase-js`) — Google OAuth + email/password
- **CSS:** Tailwind CSS v4 (`@tailwindcss/postcss`)
- **UI primitives:** Radix UI (shadcn/ui-style), tại `src/components/ui/`
- **Icons:** Lucide React
- **SEO:** Next.js per-route `metadata` exports + JSON-LD trong `app/layout.tsx`
- **Fonts:** `next/font/google` — Be Vietnam Pro
- **Linting:** `next lint` (eslint-config-next)
- **Package Manager:** npm (lockfile npm; `pnpm-workspace.yaml` là tàn dư, bỏ qua)

Note: planned backend là **ASP.NET 8 Web API** (Clean Architecture + CQRS) — xem `docs/ASPNET_BACKEND_ARCHITECTURE.md`. Hiện tại data + auth chạy thẳng qua Supabase.

---

## 📄 Các trang đã có

### Storefront

| Route | Page |
|---|---|
| `/` | Trang chủ (hero, sản phẩm nổi bật, nhãn tươi, nhãn sấy, promotion) |
| `/san-pham/nhan-tuoi` | Danh sách nhãn lồng tươi |
| `/san-pham/nhan-say` | Danh sách nhãn sấy |
| `/san-pham/[slug]` | Chi tiết sản phẩm (SSG qua `generateStaticParams`) — variants, gallery, mô tả đầy đủ |
| `/lien-he` | Form liên hệ + thông tin + FAQ |
| `/tai-khoan` | Hồ sơ cá nhân (view/edit) — yêu cầu đăng nhập |
| `/tai-khoan/don-hang` | Lịch sử đơn hàng + filter theo trạng thái — yêu cầu đăng nhập |
| `/auth/callback` | Supabase OAuth callback |
| `/sitemap.xml`, `/robots.txt` | Generated qua `app/sitemap.ts`, `app/robots.ts` |

### Trang Admin (`/admin/*`, route group `(admin)`)
- ✅ Server-side guard: redirect anon → `/auth/dang-nhap`, `notFound()` cho non-admin
- ✅ Dashboard KPIs (đơn hôm nay, doanh thu 7 ngày, low stock, tin nhắn chưa đọc)
- ✅ Quản lý sản phẩm (`/admin/san-pham`) — list, `moi/`, `[id]/`, có `ProductForm` + `ToggleActiveButton` + `actions.ts`
- ✅ Quản lý đơn hàng (`/admin/don-hang`) — list theo status, detail, transition status + ghi `OrderStatusHistories`
- ✅ Quản lý khách hàng (`/admin/khach-hang`) — list `app_users` + orders của họ (read-only)
- ✅ Quản lý kho (`/admin/kho`) — variants + stock, low-stock highlight, inline edit
- ✅ Tin nhắn liên hệ (`/admin/tin-nhan`) — inbox, toggle `IsRead`
- ⚙️ `/admin/cai-dat` — placeholder, chưa wired
- ⚠️ Yêu cầu role `Admin` trong `app_users.Role`

---

## 🧩 Components chính

### Layout (`src/components/layout/`)
- **Header / HeaderInteractive** — Server + Client split. Logo, nav, phone, user menu, cart badge.
- **Footer** — 4 columns layout.

### Cart (`src/components/cart/`)
- **CartProvider** — React Context, persist vào `localStorage`.
- **CartMerge** — reconcile guest cart với user cart sau khi đăng nhập.

### Product Components
- **ProductCard** — image, name, price, badge, rating, CTA.
- **ProductDetailPage** — gallery, variants picker, mô tả, related info.

### Modal Components
- **LoginModal** — 3 tabs: Đăng nhập, Đăng ký, Khách (Google OAuth + email/password).
- **CartModal** — 3 steps: Giỏ hàng → Thanh toán → Thành công.

### Page Components (legacy, dùng trong route tương ứng)
- **AccountPage**, **OrdersPage**, **ContactPage**, **FarmPage**

### Admin Components (`src/components/admin/`)
- **AdminSidebar / AdminTopbar** — shell `/admin/*`.
- **DataTable** — sortable/paginated wrapper, search slot.
- **StatusBadge** — re-use palette từ `OrdersPage`.
- **StatCard** — KPI tile cho dashboard.

### Global
- **FloatingContactButtons** — Phone, Zalo, Messenger (sticky bottom-right).

---

## ✨ Tính năng đã triển khai

### Shopping Features
- ✅ Thêm sản phẩm vào giỏ hàng (persist `localStorage`)
- ✅ Variants picker (nhiều size/dung lượng mỗi sản phẩm)
- ✅ Xem giỏ hàng, tăng/giảm, xóa
- ✅ Checkout form (COD / Chuyển khoản)
- ✅ Tính tổng tiền + phí ship
- ✅ Success screen

### User Features
- ✅ Đăng nhập / Đăng ký (Supabase: Google OAuth + email/password)
- ✅ Mua với tư cách khách (guest cart auto-merge khi đăng nhập)
- ✅ User menu dropdown + Đăng xuất
- ✅ Xem/Sửa hồ sơ
- ✅ Lịch sử đơn hàng + filter theo trạng thái

### Navigation Features
- ✅ **URL-based routing** (Next.js App Router) — mỗi page có URL riêng, crawlable
- ✅ `next/link` cho client-side navigation
- ✅ Mobile hamburger menu, sticky header
- ✅ Breadcrumb navigation

### UI/UX Features
- ✅ Tab filters, modals/dialogs, cart badge counter
- ✅ Mobile responsive (mobile-first)
- ✅ Hover effects, empty states, loading states

---

## 🎨 Design System

### Colors
- **Primary Green:** #43A047
- **Dark Green:** #1F5E3B (headings)
- **Light Green:** #DFF5E1 (backgrounds)
- **Longan Yellow:** #F4B942 (badges)
- **Cream:** #FFF8E7 (sections)
- **Price Red:** #DC2626
- **Grays:** #1F2937, #6B7280, #E5E7EB, #FAFAFA

### Typography (6 sizes)
- `text-4xl` — Hero (36–48px)
- `text-2xl` — Section (24px)
- `text-lg` — Lead (18px)
- `text-base` — Body (16px)
- `text-sm` — Small/buttons (14px)
- `text-xs` — Captions/units (12px)

### Tokens
- `src/lib/design-tokens.ts` — TypeScript constants + `tw.*` Tailwind bundles (e.g. `tw.button.primary`).
- `rule.md` (root) — canonical brand brief.

---

## 🔍 SEO

### Meta
- ✅ Per-route `metadata` exports (title template `%s | Nhãn Việt`, description, keywords)
- ✅ Open Graph + Twitter Card
- ✅ `lang="vi"`, viewport, `metadataBase`

### Structured Data
- ✅ `Organization` schema (root layout)
- ✅ `LocalBusiness` schema (root layout)
- ✅ ContactPoint
- ⚠️ Product JSON-LD per-product — nằm trong plan, chưa apply toàn bộ

### Crawl
- ✅ `app/sitemap.ts`, `app/robots.ts` generated
- ✅ Semantic HTML, ARIA labels, alt text Vietnamese

---

## 📱 Responsive

- ✅ Mobile-first
- ✅ Desktop: max-w-7xl (1440px)
- ✅ Grid: 4 cols → 2 cols → 1 col
- ✅ Mobile hamburger, sticky header, touch-friendly

---

## 📦 Data Model

Nguồn duy nhất: **`src/lib/data/products.ts`**. Không inline products ở chỗ khác.

### Product
```ts
{
  id: string
  slug: string
  name: string
  description: string
  price: number
  oldPrice?: number
  unit: string
  image: string
  images?: string[]
  category: 'fresh' | 'dried' | 'combo'
  badge?: string
  rating: number
  fullDescription?: string
  origin?: string
  harvest?: string
  packaging?: string
  storage?: string
  shipping?: string
  variants: ProductVariant[]
  featured?: boolean
}
```

### ProductVariant
```ts
{ id: string; name: string; price: number; oldPrice?: number; stock: number }
```

### Supabase tables (PascalCase, quoted identifiers)
`app_users`, `Products`, `ProductVariants`, `Orders`, `OrderItems`, `OrderStatusHistories`, `Carts`, `CartItems`, `ContactMessages`. Schema notes + recommended `Orders.PaymentStatus` add: xem `docs/ADMIN_PLAN.md`.

---

## ⚠️ Chưa có / Cần làm thêm

### Backend nghiệp vụ (ASP.NET 8)
- 🟡 Đang ở giai đoạn thiết kế (Clean Architecture + CQRS) — `docs/ASPNET_BACKEND_ARCHITECTURE.md`
- ❌ Chưa có API endpoints; hiện tại frontend gọi thẳng Supabase
- ❌ Payment gateway integration
- ❌ Email / SMS notifications

### Frontend
- ❌ Product search (full-text)
- ❌ Product filter nâng cao (giá, rating, origin)
- ❌ Pagination cho danh sách sản phẩm
- ❌ Wishlist / Favorites
- ❌ Product reviews/ratings input
- ❌ Image zoom / gallery lightbox
- ❌ Related products, Recently viewed
- 🟡 Phase 5 (image optimization với `next/image` + Supabase Storage) đang là việc tiếp theo

### Admin
- ✅ Admin dashboard, products CRUD, orders, customers, inventory, contact messages
- ❌ Analytics/Reports nâng cao (revenue trends, top products…)
- ❌ Audit log (`AuditLogs` table) — defer cho đến khi có >1 admin
- ❌ Discount/Voucher engine
- ❌ Settings page (`/admin/cai-dat`)

### Other
- ❌ Blog/News section
- ❌ Testimonials/Reviews section
- ❌ Loyalty program
- ❌ Multi-language support
- ❌ Dark mode (next-themes có trong deps nhưng chưa bật)

---

## 🚀 Migration Status

Xem `docs/NEXTJS_MIGRATION_PLAN.md` — nguồn chân lý về định hướng.

- ✅ **Phase 0** — Extract products data, prune unused deps
- ✅ **Phase 1** — Next.js scaffold (App Router)
- ✅ **Phase 2** — Decompose `App.tsx` → routes, CartProvider, Header/Footer (~21 SSG pages)
- ✅ **Phase 3** — Per-route metadata, sitemap, robots
- ✅ **Phase 4** — Supabase auth (Google OAuth + email/password) + middleware session
- 🟡 **Phase 5** — Image optimization (`next/image` + Supabase Storage) — đang làm
- ⏭️ Phase 6+ — Per-product JSON-LD, performance pass, deployment

---

## 📁 Cấu trúc File chính

```
nextjs-web-ban-hang/
├── middleware.ts                # Supabase session refresh
├── next.config.mjs
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout (fonts, metadata, JSON-LD, providers)
│   │   ├── page.tsx             # Home
│   │   ├── lien-he/
│   │   ├── san-pham/
│   │   │   ├── nhan-tuoi/page.tsx
│   │   │   ├── nhan-say/page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── tai-khoan/{page.tsx, don-hang/}
│   │   ├── auth/callback/
│   │   ├── (admin)/admin/       # Admin route group
│   │   │   ├── layout.tsx       # Server-side guard
│   │   │   ├── page.tsx         # Dashboard
│   │   │   ├── san-pham/        # CRUD + actions.ts
│   │   │   ├── don-hang/        # list + [id]/ + actions.ts
│   │   │   ├── khach-hang/
│   │   │   ├── kho/
│   │   │   ├── tin-nhan/
│   │   │   └── cai-dat/
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── layout/{Header,HeaderInteractive,Footer}.tsx
│   │   ├── cart/{CartProvider,CartMerge}.tsx
│   │   ├── admin/{AdminSidebar,AdminTopbar,DataTable,StatCard,StatusBadge}.tsx
│   │   ├── ui/                  # shadcn/ui primitives
│   │   ├── seo/
│   │   ├── ProductCard.tsx, ProductDetailPage.tsx
│   │   ├── CartModal.tsx, LoginModal.tsx
│   │   ├── AccountPage.tsx, OrdersPage.tsx, ContactPage.tsx, FarmPage.tsx
│   │   └── FloatingContactButtons.tsx
│   ├── lib/
│   │   ├── data/products.ts     # Single source of truth for products
│   │   ├── supabase/{client,server,middleware}.ts
│   │   ├── api/{client,server}.ts
│   │   ├── design-tokens.ts
│   │   └── utils.ts
│   └── styles/
└── docs/
    ├── NEXTJS_MIGRATION_PLAN.md
    ├── ADMIN_PLAN.md
    ├── ASPNET_BACKEND_ARCHITECTURE.md, CLEAN_ARCHITECTURE.md
    ├── SEO_ANALYSIS.md
    ├── PRODUCT_DETAIL_GUIDE.md, PRODUCT_VARIANTS_IMPLEMENTATION.md
    └── WEBSITE_SUMMARY.md       # This file
```

---

## 🎯 Điểm mạnh

1. ✅ **URL-based routing** — mỗi page crawlable, sitemap đầy đủ
2. ✅ **SSG + Server Components** — render nhanh, SEO tốt
3. ✅ **Auth thật** — Supabase + middleware session refresh
4. ✅ **Admin surface** — đủ để vận hành đơn hàng + sản phẩm
5. ✅ **Design system nhất quán** — tokens + Tailwind v4
6. ✅ **TypeScript** — types đầy đủ cho `Product` / `ProductVariant`
7. ✅ **Documentation** — migration plan, admin plan, SEO audit, backend architecture

---

## 🎯 Hạn chế / Đang xử lý

1. 🟡 **Images chưa optimize** — Phase 5 (`next/image` + Supabase Storage) đang làm
2. ❌ **Chưa có payment gateway** — checkout vẫn dừng ở COD / Chuyển khoản thủ công
3. ❌ **Backend nghiệp vụ (.NET)** — mới ở giai đoạn thiết kế
4. ❌ **Chưa có product search / advanced filter / pagination**
5. ⚠️ **Schema gaps** — `Orders.PaymentStatus`, `AuditLogs` (xem `ADMIN_PLAN.md`)

---

## 📝 Ghi chú vận hành

- **Dev:** `npm run dev`
- **Build:** `npm run build` (emits ~21 SSG pages)
- **Lint:** `npm run lint`
- **Typecheck:** `npx tsc --noEmit`
- **Env:** `.env.local` với `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`

---

## 📞 Contact Info (trong website)

- **Phone:** 0866.918.366
- **Email:** cskh@nhanviet.vn
- **Địa chỉ:** Hưng Yên / Bắc Giang, Việt Nam
- **Social:** Zalo, Messenger (floating buttons)

---

**Tóm lại:** Migration Vite → Next.js 14 App Router đã hoàn tất qua Phase 4. Storefront chạy với URL-based routing + per-route metadata + Supabase auth. Admin surface đã ship. Việc tiếp theo: optimize images (Phase 5), bổ sung product JSON-LD, và lên kế hoạch backend ASP.NET cho nghiệp vụ.

---

## Changelog

- **2.0.0** (2026-05-14) — Major rewrite to reflect Next.js 14 App Router reality: replaced "React 18 + Figma Make" stack with Next.js + Supabase + middleware; rewrote routing section as real URL table; flipped state-based routing claim; added migration phase status, server-action mutation pattern, single-source product data module; updated file tree to actual repo layout.
- **1.1.0** (2026-05-14) — Added Admin section (route group `(admin)`, dashboard, products/orders/customers/inventory/messages); flipped "Admin" checklist from ❌ → ✅; backfilled frontmatter (replaces inline "Cập nhật: 8/5/2026" note).
- **1.0.0** (2026-05-08) — Initial website summary covering frontend pages, components, design system, SEO, data model, and gaps.
