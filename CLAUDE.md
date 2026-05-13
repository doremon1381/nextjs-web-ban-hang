# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Heads-up: the repo name is misleading

The repo is named `nextjs-web-ban-hang` but is **not** a Next.js project. It is a **Vite + React 18 SPA** exported from Figma Make. The Next.js move is planned, not done — see `docs/NEXTJS_MIGRATION_PLAN.md`. Do not assume App Router, server components, or `next/*` imports exist; they do not.

## Commands

- `npm i` — install (the README and `package-lock.json` use npm; a `pnpm-workspace.yaml` is also present from a prior attempt, but the lockfile is npm's — prefer npm)
- `npm run dev` — Vite dev server
- `npm run build` — Vite production build

There is no lint script, no test runner, and no typecheck script configured. `tsc --noEmit` works ad-hoc against `tsconfig.json` if a typecheck is needed.

## Architecture

### Application shape

Everything renders through `src/main.tsx` → `src/app/App.tsx`. `App.tsx` is a ~900-line monolith that holds:

- The home page UI (hero, featured products, fresh longan section, dried longan section, promotion banner)
- All product data, inline in three arrays (`featuredProducts`, `freshLonganProducts`, `driedLonganProducts`) around lines 129–369
- A state-based pseudo-router via `useState<'home' | 'product-detail' | 'contact' | 'account' | 'orders'>('home')` — every "page" lives at the same URL `/`
- The single global `<Helmet>` block (title, description, OG tags, Organization + LocalBusiness JSON-LD) — this metadata does not change between "pages"

Sub-pages (`ProductDetailPage`, `ContactPage`, `AccountPage`, `OrdersPage`, `FarmPage`) live in `src/app/components/` and are rendered conditionally based on `currentPage`. Navigation is `<button onClick={navigateToPage(...)}>`, not `<a>` — crawlers cannot follow it.

### Cart and auth

Cart state lives in `App.tsx` as `useState<CartItem[]>` and is passed down to `CartModal`. It is **not** persisted (no localStorage). `LoginModal` writes to a local `user` state — there is no real authentication, no backend, no API routes.

### UI primitives

`src/app/components/ui/` is a shadcn/ui-style collection built on `@radix-ui/*`. Compose new UI from these primitives rather than reaching for `@mui/material` or `@emotion/*` even though those are in `package.json` — they are leftover and unused.

### Design system

`src/lib/design-tokens.ts` exports brand colors, typography scales, and pre-baked Tailwind class bundles under `tw.*` (e.g., `tw.button.primary`, `tw.typography.hero`). The same brand palette is also specified in `rule.md` (the original product brief in Vietnamese). When adding new UI, pull colors from these tokens — do not invent new hex values.

Tailwind v4 is configured via `@tailwindcss/vite` in `vite.config.ts`. Global styles import from `src/styles/index.css` and `src/styles/theme.css`.

### Figma asset convention

`vite.config.ts` registers a `figma-asset-resolver` plugin that rewrites `figma:asset/<filename>` imports to `src/assets/<filename>`. No current source file uses this protocol, so the plugin can be removed during the Next.js migration. If you encounter `figma:asset/...` imports, that is what they mean.

### Content language and SEO context

The site is a Vietnamese e-commerce storefront for fresh and dried longan (`nhãn lồng tươi`, `nhãn sấy`) targeted at the Vietnamese market. Brand: **Nhãn Việt**. All user-facing copy is in Vietnamese with diacritics. Vietnamese SEO is the main business driver behind the planned migration — `docs/seo_analysis.md` and `docs/NEXTJS_MIGRATION_PLAN.md` are the primary references for why the architecture is changing.

### Authoritative docs in `docs/`

- `NEXTJS_MIGRATION_PLAN.md` — current trimmed migration plan (the source of truth for direction). Phase 0 (extract products to `lib/data/products.ts`, prune unused deps) can be done in the current Vite repo before any Next.js work.
- `seo_analysis.md` — earlier SEO audit; some claims (heading hierarchy, missing JSON-LD) are stale because the codebase moved since.
- `PRODUCT_DETAIL_GUIDE.md`, `PRODUCT_VARIANTS_IMPLEMENTATION.md`, `WEBSITE_SUMMARY.md` — feature docs for the product detail flow and variant system already implemented in `ProductDetailPage.tsx`.
- `rule.md` (root) — original Figma brief, the canonical reference for brand voice, palette, layout intent.

### Dependency reality

`package.json` lists many libraries that no source file imports: `@mui/*`, `@emotion/*`, `react-slick`, `embla-carousel-react`, `react-dnd*`, `react-responsive-masonry`, `vaul`, `react-popper`, `next-themes`, `canvas-confetti`, `react-day-picker`, and notably `react-router` (the SPA does not use it — routing is state-based). Verify with `grep` before assuming anything is in use. Phase 0 of the migration plan covers pruning these.

## Conventions when editing

- Vietnamese copy: always include diacritics. Slug-style fallbacks (`nhan-long-tuoi`) are for URLs, never for visible text.
- Product data currently lives inside `App.tsx`. If you add a product, mirror the existing shape (`id`, `name`, `description`, `price`, `unit`, `image`, `images[]`, `category`, `rating`, `variants[]`, optional `badge`, `fullDescription`, `origin`, `harvest`, `packaging`). Each variant needs `id`, `name`, `price`, `stock`.
- Navigation: the current pattern is `navigateToPage('foo')`. This is a known anti-pattern (no real URL), being removed in the Next.js migration. Do not extend it — if you need to add a new "page" before the migration, raise it; otherwise inline new sections into the home flow.
- Images: every `<img>` should have a descriptive `alt` in Vietnamese (see `ProductCard.tsx:56` for the pattern `${name} - ${description}`).
