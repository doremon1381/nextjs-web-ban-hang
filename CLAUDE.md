---
version: 2.0.0
updated: 2026-05-14
status: active
---

# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this repo actually is

A **Next.js 14 App Router** site for **Nhãn Việt**, a Vietnamese e-commerce storefront selling fresh longan (`nhãn lồng tươi`) and dried longan (`nhãn sấy`). The earlier Vite + React 18 SPA exported from Figma Make has been migrated — Phases 0–4 of `docs/NEXTJS_MIGRATION_PLAN.md` are complete. Admin surface (`/admin/*`) has shipped as a route group.

If older docs still describe a Vite SPA or `App.tsx` monolith, trust the code, not the doc. The migration plan and `docs/WEBSITE_SUMMARY.md` are the live references.

## Commands

- `npm i` — install (lockfile is npm; a leftover `pnpm-workspace.yaml` exists but is ignored — prefer npm)
- `npm run dev` — Next.js dev server
- `npm run build` — production build (currently emits ~21 SSG pages)
- `npm run start` — serve the built output
- `npm run lint` — `next lint` (ESLint via `eslint-config-next`)
- `npx tsc --noEmit` — ad-hoc typecheck (no dedicated script)

No test runner is wired up yet.

## Architecture

### Routing (App Router)

```
src/app/
├── layout.tsx              # Root layout: fonts, metadata, JSON-LD, CartProvider, Header/Footer, modals
├── page.tsx                # Home (hero, featured, fresh/dried sections)
├── lien-he/                # /lien-he — contact page
├── san-pham/
│   ├── nhan-tuoi/page.tsx  # /san-pham/nhan-tuoi — fresh longan listing
│   ├── nhan-say/page.tsx   # /san-pham/nhan-say — dried longan listing
│   └── [slug]/page.tsx     # /san-pham/<slug> — product detail (SSG via generateStaticParams)
├── tai-khoan/
│   ├── page.tsx            # /tai-khoan — account profile
│   └── don-hang/           # /tai-khoan/don-hang — order history
├── auth/callback/          # Supabase OAuth callback
├── (admin)/admin/          # Admin route group (see "Admin surface" below)
├── sitemap.ts, robots.ts   # Generated sitemap + robots
└── not-found.tsx
```

Storefront slugs stay Vietnamese (`/san-pham/nhan-tuoi`, `/lien-he`, `/tai-khoan`). `/admin/*` is the only English namespace.

### Auth & session (Supabase)

- `@supabase/ssr` is the integration; clients live in `src/lib/supabase/`:
  - `client.ts` — browser client
  - `server.ts` — server client (Server Components, server actions)
  - `middleware.ts` — `updateSession()` helper for rotating session cookies
- Root `middleware.ts` runs on every navigation (matcher excludes static assets) so Supabase cookies stay fresh.
- Google OAuth + email/password are supported; callback lands at `/auth/callback`.
- App users live in the `app_users` table; admin gating is `app_users.Role = 'Admin'`.

### Admin surface

Route group: `src/app/(admin)/admin/`.

```
admin/
├── layout.tsx              # Server-side guard: redirect anon → /auth/dang-nhap, notFound() if Role ≠ Admin
├── page.tsx                # Dashboard KPIs
├── san-pham/               # Products CRUD (list, moi/, [id]/, actions.ts, ProductForm.tsx, ToggleActiveButton.tsx)
├── don-hang/               # Orders (list, [id]/, actions.ts — status transitions write OrderStatusHistories)
├── khach-hang/             # Customers (read-only)
├── kho/                    # Inventory with low-stock highlighting
├── tin-nhan/               # ContactMessages inbox
└── cai-dat/                # Settings (placeholder)
```

Mutation pattern is **server actions** colocated as `actions.ts` next to the page. Every action must re-check `Role = 'Admin'` server-side — never trust the layout alone.

### Cart

`src/components/cart/CartProvider.tsx` holds cart state via React Context. `CartMerge.tsx` reconciles guest cart with the signed-in user's cart on login. State persists in `localStorage` (not in `useState` only — that was the pre-migration model).

### Data layer

- Product data: **`src/lib/data/products.ts`** — single source of truth, exports `products`, `getProducts({ category, featured, slug })`, and `Product` / `ProductVariant` / `ProductCategory` types. **Do not** re-introduce inline product arrays anywhere else.
- Server-side data access for admin/orders goes through `src/lib/api/server.ts`; browser-side through `src/lib/api/client.ts`.
- Supabase tables (PascalCase, quoted identifiers): `app_users`, `Products`, `ProductVariants`, `Orders`, `OrderItems`, `OrderStatusHistories`, `Carts`, `CartItems`, `ContactMessages`. See `docs/ADMIN_PLAN.md` for schema notes and the recommended `Orders.PaymentStatus` add.

### UI primitives

`src/components/ui/` is a shadcn/ui-style collection on top of `@radix-ui/*`. Compose new UI from these primitives — do **not** pull in `@mui/material` or `@emotion/*` (they are not in `package.json` anymore; Phase 0 pruned them along with unused libs).

Admin-specific UI helpers are in `src/components/admin/`: `AdminSidebar`, `AdminTopbar`, `DataTable`, `StatCard`, `StatusBadge`.

### Design system

`src/lib/design-tokens.ts` exports brand colors, typography scales, and pre-baked Tailwind class bundles under `tw.*` (e.g. `tw.button.primary`, `tw.typography.hero`). The same palette is in `rule.md` (the original Vietnamese product brief). Pull colors from these tokens — do not invent new hex values.

Tailwind v4 via `@tailwindcss/postcss`. Global styles live in `src/app/globals.css`.

### SEO

- Per-route `metadata` exports drive `<title>`, description, OG, Twitter tags (no more global-only `<Helmet>` block).
- Root layout injects `Organization` + `LocalBusiness` JSON-LD.
- `sitemap.ts` and `robots.ts` are generated routes; product slugs feed the sitemap.
- Vietnamese SEO is the business driver — `docs/SEO_ANALYSIS.md` is the audit, `docs/NEXTJS_MIGRATION_PLAN.md` explains how routing changes serve it.

### Authoritative docs in `docs/`

- `NEXTJS_MIGRATION_PLAN.md` — current trimmed plan (the source of truth for direction). Phases 0–4 done; Phase 5 is the images pass.
- `ADMIN_PLAN.md` — admin surface plan; current Supabase schema assessment + execution order.
- `ASPNET_BACKEND_ARCHITECTURE.md`, `CLEAN_ARCHITECTURE.md` — .NET 8 backend design (separate roadmap; not the Next.js codebase).
- `WEBSITE_SUMMARY.md` — high-level feature inventory (Vietnamese).
- `SEO_ANALYSIS.md` — SEO audit; some early claims have been addressed since the migration.
- `PRODUCT_DETAIL_GUIDE.md`, `PRODUCT_VARIANTS_IMPLEMENTATION.md` — feature docs for the product detail + variants flow.
- `rule.md` (root) — original Figma brief; canonical reference for brand voice, palette, layout intent.

## Conventions when editing

- **Vietnamese copy**: always include diacritics. Slug-style fallbacks (`nhan-long-tuoi`) are for URLs only, never for visible text.
- **Products**: add to `src/lib/data/products.ts`. Mirror the shape (`id`, `slug`, `name`, `description`, `price`, `unit`, `image`, `images[]`, `category`, `rating`, `variants[]`, optional `badge`, `fullDescription`, `origin`, `harvest`, `packaging`, `storage`, `shipping`, `featured`). Each variant needs `id`, `name`, `price`, `stock`.
- **Navigation**: use `next/link` and real URLs. The old `navigateToPage('foo')` state-router is gone — do not bring it back.
- **Server vs Client Components**: default to Server Components. Reach for `'use client'` only for components that need state, effects, or browser APIs (cart, modals, interactive header pieces — see `HeaderInteractive.tsx` for the split pattern).
- **Mutations**: prefer server actions (`'use server'` in `actions.ts`) over route handlers. Re-check auth inside every action.
- **Images**: every `<img>` / `next/image` needs a descriptive Vietnamese `alt`. Pattern: `${name} - ${description}` (see `ProductCard.tsx`).
- **Doc edits**: every `.md` write/edit in this repo must follow `.claude/skills/doc-version/SKILL.md` — bump version, add a changelog entry. CLAUDE.md and README.md included.

## Doc versioning

This file is versioned. See the frontmatter at the top and the `## Changelog` section at the bottom. Any substantive edit (beyond pure typos) must bump the version per the doc-version skill.

## Changelog

- **2.0.0** (2026-05-14) — Replaced the "Vite + React 18 SPA from Figma Make" framing with the current Next.js 14 App Router reality; documented Supabase auth + middleware, admin route group, products data module, server-action mutation pattern, per-route metadata. Conclusions reversed — readers of 1.x must re-read.
- **1.0.0** (date unknown) — Initial CLAUDE.md describing the pre-migration Vite SPA, state-based pseudo-router, and `App.tsx` monolith.
