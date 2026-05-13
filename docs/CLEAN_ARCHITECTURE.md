# Clean Architecture for the Nhãn Việt Next.js Codebase

> Companion to `NEXTJS_MIGRATION_PLAN.md`. The migration plan describes *what* to move and *when*. This document describes *how to structure code inside Next.js* so the codebase stays testable, swappable, and aligned with the domain (longan e-commerce) rather than the framework.

---

## 1. Why bother — and where to stop

Clean architecture is a tool, not a religion. For a small e-commerce site you do **not** need 6 layers, interface segregation per use case, or a separate DTO for every entity. The point is one thing: **business rules must not depend on Next.js, React, Tailwind, or any data source.**

When that one rule is honored, the following things become cheap:

- Swapping in-memory product data for a CMS or database (Phase 0 → Phase N) without touching pages.
- Replacing the mock cart with a server-backed cart without touching `ProductCard`.
- Adding a real auth provider (Auth.js, Clerk, custom) without touching the order flow.
- Unit-testing pricing, discount, and cart math without spinning up Next.js.

What we deliberately do **not** do:

- One interface per use case "just in case".
- DTOs for entities that already match the wire format.
- A separate `Repository` for every model when one query function covers it.
- "Mappers" that copy fields one-for-one with no transformation.

If a layer cannot justify its existence with a name of a concrete future change it enables, it should not exist yet.

---

## 2. Layer model

Four layers, ordered by stability (most stable at top). **Dependencies always point upward** — outer layers know about inner layers, never the reverse.

```
┌─────────────────────────────────────────────────────────────┐
│  domain         Entities, value objects, pure business rules │  ← no imports from anywhere below
├─────────────────────────────────────────────────────────────┤
│  application    Use cases (orchestrate domain + ports)       │  ← imports domain only
├─────────────────────────────────────────────────────────────┤
│  infrastructure Adapters: data sources, email, storage, auth │  ← implements ports from application
├─────────────────────────────────────────────────────────────┤
│  presentation   Next.js: app/, components/, hooks/, actions/ │  ← composes everything, owns no business rules
└─────────────────────────────────────────────────────────────┘
```

### 2.1. `domain/` — what the business is

Pure TypeScript. No `next/*`, no `react`, no I/O, no async, no `fetch`. Compiles and runs anywhere.

Contents for this project:
- **Entities**: `Product`, `Variant`, `Cart`, `CartLine`, `Order`, `Customer`
- **Value objects**: `Money` (amount + currency=VND), `Slug`, `Quantity`, `Rating`
- **Domain services**: `pricing.ts` (`calculateLineTotal`, `applyPromoCode`), `cart.ts` (`addLine`, `removeLine`, `mergeCarts`)
- **Domain errors**: `OutOfStockError`, `InvalidVariantError`

A function in `domain/` is a good fit when you can write a unit test for it that imports nothing but the function itself.

### 2.2. `application/` — what the system does

Use cases that orchestrate the domain. Each use case is a function `(input) => Promise<output>` that depends on **ports** (interfaces) declared in this layer, never on concrete implementations.

```
application/
  ports/                  # interfaces the infrastructure must satisfy
    product-repository.ts
    cart-storage.ts
    contact-sender.ts
  use-cases/
    list-products.ts
    get-product-by-slug.ts
    add-to-cart.ts
    submit-contact.ts
  errors.ts               # application-level errors (NotFound, ValidationError)
```

Use cases are **the only thing pages and server actions call**. Pages do not reach into repositories directly.

### 2.3. `infrastructure/` — how the world is

Concrete adapters that implement the ports. One file per port implementation.

```
infrastructure/
  products/
    in-memory-product-repository.ts    # current: reads from /data
    cms-product-repository.ts          # future: Sanity / Strapi / DB
  cart/
    local-storage-cart.ts              # browser cart
    cookie-cart.ts                     # server-readable cart (later)
  email/
    resend-contact-sender.ts           # later
    noop-contact-sender.ts             # current: logs to console
  config.ts                            # env var loading + validation (zod)
```

Picking which adapter the app uses happens in **one** place: `infrastructure/container.ts` (see §4).

### 2.4. `presentation/` — Next.js surface

Everything the framework owns. This layer is allowed to know about every other layer, but every other layer is forbidden from importing from here.

```
app/                        # Next.js App Router
  layout.tsx
  page.tsx
  san-pham/[slug]/page.tsx
  api/                      # route handlers (rare — server actions preferred)
  actions/                  # server actions, one file per use case
components/                 # React components (Server + Client)
  layout/ home/ products/ cart/ ui/
hooks/                      # React hooks (useCart, useToast)
lib/                        # framework glue (cn, formatters)
```

Server components call use cases directly. Client components call **server actions** that call use cases. Components never import from `infrastructure/`.

---

## 3. Directory layout (full)

```
src/
├── domain/
│   ├── product/
│   │   ├── product.ts                    # type Product, type Variant
│   │   ├── pricing.ts                    # pure functions
│   │   └── product.errors.ts
│   ├── cart/
│   │   ├── cart.ts                       # type Cart, type CartLine
│   │   ├── cart.operations.ts            # pure functions: addLine, etc.
│   │   └── cart.errors.ts
│   ├── shared/
│   │   ├── money.ts                      # VND value object + format
│   │   ├── slug.ts
│   │   └── result.ts                     # Result<T, E> helper
│   └── index.ts                          # public barrel
│
├── application/
│   ├── ports/
│   │   ├── product-repository.ts
│   │   ├── cart-storage.ts
│   │   └── contact-sender.ts
│   ├── use-cases/
│   │   ├── list-products.ts
│   │   ├── get-product-by-slug.ts
│   │   ├── get-related-products.ts
│   │   ├── add-to-cart.ts
│   │   ├── update-cart-line.ts
│   │   ├── remove-cart-line.ts
│   │   └── submit-contact.ts
│   └── errors.ts
│
├── infrastructure/
│   ├── products/
│   │   ├── data/products.json            # source of truth for now
│   │   └── in-memory-product-repository.ts
│   ├── cart/
│   │   └── local-storage-cart.ts
│   ├── email/
│   │   └── noop-contact-sender.ts
│   ├── config.ts
│   └── container.ts                      # wires ports → adapters
│
├── app/                                  # Next.js routes only
├── components/
├── hooks/
├── lib/                                  # cn(), formatters — framework glue
└── styles/
```

Keep `src/` as the only top-level source folder so `tsconfig.json`'s `paths` alias (`@/*`) stays clean.

---

## 4. The dependency injection seam

One file resolves which adapter implements each port. Pages and server actions import from here.

```ts
// src/infrastructure/container.ts
import type { ProductRepository } from '@/application/ports/product-repository';
import type { CartStorage } from '@/application/ports/cart-storage';
import type { ContactSender } from '@/application/ports/contact-sender';

import { inMemoryProductRepository } from './products/in-memory-product-repository';
import { localStorageCart } from './cart/local-storage-cart';
import { noopContactSender } from './email/noop-contact-sender';
import { resendContactSender } from './email/resend-contact-sender';
import { config } from './config';

export const productRepository: ProductRepository = inMemoryProductRepository();

export const cartStorage: CartStorage = localStorageCart();   // browser-side import only

export const contactSender: ContactSender =
  config.RESEND_API_KEY ? resendContactSender(config.RESEND_API_KEY) : noopContactSender();
```

This is the **only** place adapter choices live. Replacing the product source later is a one-line edit.

A use case takes its dependencies as plain arguments — no DI framework, no decorators:

```ts
// src/application/use-cases/get-product-by-slug.ts
import type { ProductRepository } from '@/application/ports/product-repository';
import type { Product } from '@/domain/product/product';
import { NotFoundError } from '@/application/errors';

export const getProductBySlug =
  (deps: { products: ProductRepository }) =>
  async (slug: string): Promise<Product> => {
    const product = await deps.products.findBySlug(slug);
    if (!product) throw new NotFoundError(`Product '${slug}' not found`);
    return product;
  };
```

Callers (pages, actions) do the trivial wiring:

```ts
// somewhere in app/
import { productRepository } from '@/infrastructure/container';
import { getProductBySlug } from '@/application/use-cases/get-product-by-slug';

const product = await getProductBySlug({ products: productRepository })(slug);
```

If the partial application becomes annoying, expose pre-wired wrappers in `infrastructure/container.ts`:

```ts
export const useCases = {
  getProductBySlug: getProductBySlug({ products: productRepository }),
  listProducts: listProducts({ products: productRepository }),
  submitContact: submitContact({ sender: contactSender }),
};
```

Then callers write `useCases.getProductBySlug(slug)`.

---

## 5. Where Next.js features live

| Next.js feature | Layer | Notes |
|---|---|---|
| `app/page.tsx`, `app/[slug]/page.tsx` | presentation | Server component. Imports use cases. No business logic. |
| `generateMetadata`, `generateStaticParams` | presentation | Calls use cases to fetch data; maps to `Metadata`. |
| Server actions (`'use server'`) | presentation | Thin wrappers: validate input with Zod, call use case, return DTO. |
| Route handlers (`app/api/.../route.ts`) | presentation | Only when an external client needs JSON (webhooks, integrations). Otherwise prefer server actions. |
| Middleware (`middleware.ts`) | presentation | Auth gates, locale rewrites. No domain logic. |
| `next/image`, `next/link`, `next/font` | presentation | Components only. |
| `revalidatePath`, `revalidateTag` | presentation | Called from server actions after a mutation. |
| `cookies()`, `headers()` | infrastructure adapters | Wrap them in a port (e.g. `CartStorage` reads/writes a cookie); pages never call `cookies()` directly. |
| Environment variables | infrastructure (`config.ts`) | Single zod-validated config object. No `process.env` reads anywhere else. |

---

## 6. Worked example — Product detail page

End-to-end, every layer touched.

**Domain** (`src/domain/product/product.ts`):
```ts
export type ProductCategory = 'fresh' | 'dried' | 'combo';

export interface Variant {
  id: string;
  name: string;
  price: number;       // VND, integer dong
  oldPrice?: number;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  fullDescription?: string;
  category: ProductCategory;
  unit: string;
  image: string;
  images?: string[];
  rating: number;
  badge?: string;
  variants: Variant[];
  featured?: boolean;
  origin?: string;
  harvest?: string;
  packaging?: string;
}

export const minPrice = (p: Product): number =>
  p.variants.length > 0 ? Math.min(...p.variants.map(v => v.price)) : 0;

export const isOnSale = (v: Variant): boolean =>
  v.oldPrice !== undefined && v.oldPrice > v.price;

export const discountPercent = (v: Variant): number =>
  isOnSale(v) ? Math.round(((v.oldPrice! - v.price) / v.oldPrice!) * 100) : 0;
```

**Application port** (`src/application/ports/product-repository.ts`):
```ts
import type { Product, ProductCategory } from '@/domain/product/product';

export interface ProductRepository {
  findBySlug(slug: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
  list(filter?: { category?: ProductCategory; featured?: boolean }): Promise<Product[]>;
  allSlugs(): Promise<string[]>;
}
```

**Application use cases:**
```ts
// src/application/use-cases/get-product-by-slug.ts (shown above)

// src/application/use-cases/get-related-products.ts
import type { ProductRepository } from '@/application/ports/product-repository';
import type { Product } from '@/domain/product/product';

export const getRelatedProducts =
  (deps: { products: ProductRepository }) =>
  async (current: Product, take = 4): Promise<Product[]> => {
    const sameCategory = await deps.products.list({ category: current.category });
    return sameCategory.filter(p => p.id !== current.id).slice(0, take);
  };
```

**Infrastructure adapter** (`src/infrastructure/products/in-memory-product-repository.ts`):
```ts
import type { ProductRepository } from '@/application/ports/product-repository';
import data from './data/products.json';
import type { Product } from '@/domain/product/product';

export const inMemoryProductRepository = (): ProductRepository => {
  const products = data as Product[];
  return {
    async findBySlug(slug) { return products.find(p => p.slug === slug) ?? null; },
    async findById(id) { return products.find(p => p.id === id) ?? null; },
    async list(filter) {
      return products.filter(p =>
        (!filter?.category || p.category === filter.category) &&
        (filter?.featured === undefined || !!p.featured === filter.featured)
      );
    },
    async allSlugs() { return products.map(p => p.slug); },
  };
};
```

**Presentation** (`src/app/san-pham/[slug]/page.tsx`):
```tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { useCases } from '@/infrastructure/container';
import { NotFoundError } from '@/application/errors';
import { ProductDetail } from '@/components/products/ProductDetail';
import { ProductJsonLd } from '@/components/seo/ProductJsonLd';

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  const slugs = await useCases.allProductSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const p = await useCases.getProductBySlug(params.slug);
    return {
      title: p.name,
      description: p.description,
      openGraph: { title: p.name, description: p.description, images: [p.image] },
    };
  } catch {
    return {};
  }
}

export default async function Page({ params }: Props) {
  try {
    const product = await useCases.getProductBySlug(params.slug);
    const related = await useCases.getRelatedProducts(product);
    return (
      <>
        <ProductJsonLd product={product} />
        <ProductDetail product={product} related={related} />
      </>
    );
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }
}
```

`ProductDetail` is a server component that renders the static product info. Variant selection, quantity, and "Add to cart" live in a `'use client'` child (`<AddToCartForm>`) that calls a server action.

---

## 7. Worked example — Add to cart

Where it gets interesting: client-side optimistic update + server validation.

**Domain** (`src/domain/cart/cart.operations.ts`):
```ts
import type { Cart, CartLine } from './cart';
import type { Product, Variant } from '../product/product';
import { OutOfStockError } from './cart.errors';

export const addLine = (
  cart: Cart,
  product: Product,
  variant: Variant,
  quantity: number,
): Cart => {
  if (quantity < 1) throw new Error('quantity must be >= 1');
  if (variant.stock < quantity) throw new OutOfStockError(product.id, variant.id);

  const lineId = `${product.id}:${variant.id}`;
  const existing = cart.lines.find(l => l.id === lineId);

  const nextLines: CartLine[] = existing
    ? cart.lines.map(l => l.id === lineId
        ? { ...l, quantity: Math.min(l.quantity + quantity, variant.stock) }
        : l)
    : [...cart.lines, {
        id: lineId,
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        variantName: variant.name,
        unit: product.unit,
        image: product.image,
        unitPrice: variant.price,
        quantity,
      }];

  return { ...cart, lines: nextLines };
};

export const lineTotal = (line: CartLine): number => line.unitPrice * line.quantity;
export const cartTotal = (cart: Cart): number => cart.lines.reduce((s, l) => s + lineTotal(l), 0);
export const cartCount = (cart: Cart): number => cart.lines.reduce((s, l) => s + l.quantity, 0);
```

**Use case** (`src/application/use-cases/add-to-cart.ts`):
```ts
import type { ProductRepository } from '@/application/ports/product-repository';
import type { CartStorage } from '@/application/ports/cart-storage';
import { addLine } from '@/domain/cart/cart.operations';
import { NotFoundError } from '@/application/errors';

export const addToCart =
  (deps: { products: ProductRepository; cart: CartStorage }) =>
  async (input: { slug: string; variantId: string; quantity: number }) => {
    const product = await deps.products.findBySlug(input.slug);
    if (!product) throw new NotFoundError(`Product '${input.slug}' not found`);

    const variant = product.variants.find(v => v.id === input.variantId);
    if (!variant) throw new NotFoundError(`Variant '${input.variantId}' not found`);

    const current = await deps.cart.read();
    const next = addLine(current, product, variant, input.quantity);
    await deps.cart.write(next);
    return next;
  };
```

**Server action** (`src/app/actions/cart.ts`):
```ts
'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { useCases } from '@/infrastructure/container';

const input = z.object({
  slug: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

export async function addToCartAction(raw: unknown) {
  const parsed = input.parse(raw);
  const cart = await useCases.addToCart(parsed);
  revalidatePath('/');
  return { cartCount: cart.lines.reduce((s, l) => s + l.quantity, 0) };
}
```

**Client component** (`src/components/products/AddToCartForm.tsx`):
```tsx
'use client';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { addToCartAction } from '@/app/actions/cart';

export function AddToCartForm({ slug, variantId }: { slug: string; variantId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() => startTransition(async () => {
        try {
          await addToCartAction({ slug, variantId, quantity: 1 });
          toast.success('Đã thêm vào giỏ hàng');
        } catch (e) {
          toast.error('Không thể thêm vào giỏ');
        }
      })}
    >
      Thêm vào giỏ
    </button>
  );
}
```

Note what the UI does **not** know: where cart is stored, how stock is validated, how line totals are computed. All of that is replaceable.

---

## 8. Worked example — Contact form

**Port:**
```ts
// src/application/ports/contact-sender.ts
export interface ContactMessage {
  name: string; phone: string; email: string;
  subject: string; message: string;
}
export interface ContactSender {
  send(msg: ContactMessage): Promise<void>;
}
```

**Use case** with validation in the domain layer:
```ts
// src/domain/contact/contact-message.ts
import { z } from 'zod';

export const contactMessageSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone: z.string().regex(/^0\d{9}$/, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  subject: z.string().min(2),
  message: z.string().min(10, 'Tin nhắn phải có ít nhất 10 ký tự'),
});
export type ContactMessage = z.infer<typeof contactMessageSchema>;
```

(Zod is fine in `domain/` — it is a pure runtime validator, not a framework adapter. The schema *is* the business rule for what a valid message looks like.)

```ts
// src/application/use-cases/submit-contact.ts
import type { ContactSender } from '@/application/ports/contact-sender';
import { contactMessageSchema } from '@/domain/contact/contact-message';

export const submitContact =
  (deps: { sender: ContactSender }) =>
  async (raw: unknown): Promise<void> => {
    const message = contactMessageSchema.parse(raw);
    await deps.sender.send(message);
  };
```

**Adapter (current — log only):**
```ts
// src/infrastructure/email/noop-contact-sender.ts
import type { ContactSender } from '@/application/ports/contact-sender';

export const noopContactSender = (): ContactSender => ({
  async send(msg) { console.log('[contact]', msg); },
});
```

**Adapter (future — Resend):** drop a new file, update `container.ts`, ship. No page change.

---

## 9. Testing strategy

| Layer | Tooling | What to test |
|---|---|---|
| `domain/` | Vitest, no mocks | Pricing math, cart operations, validators. Pure functions; tests are fast and deterministic. |
| `application/` | Vitest, hand-written fakes | Use cases with in-memory `ProductRepository` / `CartStorage` fakes. Verify orchestration: "when slug missing, throws NotFound"; "when stock < qty, throws OutOfStock". |
| `infrastructure/` | Vitest + real I/O when feasible | Test each adapter against the port contract. For external services (Resend), use a recorded fixture or test double. |
| `presentation/` | Playwright (a few golden flows) | Smoke: home renders, product detail renders, add-to-cart updates badge, contact form shows success. Do **not** unit-test components — they have no logic worth pinning down. |

Folder convention: tests sit next to the file under test (`pricing.ts` + `pricing.test.ts`). Playwright lives in `e2e/`.

---

## 10. Server vs client component decision rule

Default to **server**. Move to `'use client'` only when one of these is needed:

- `useState` / `useReducer` / `useEffect` / `useTransition`
- Event handlers (`onClick`, `onSubmit`) — note: a `<form action={serverAction}>` does **not** need `'use client'`
- Browser-only APIs (`localStorage`, `window`, `IntersectionObserver`)
- Third-party libraries that import React hooks

Push the `'use client'` boundary as deep as possible. The product detail page is a server component; only `<AddToCartForm>` and `<VariantSelector>` inside it are client components. The header is a server component; only `<CartButton>` and `<UserMenu>` inside it are client.

---

## 11. Anti-patterns to refuse

- **Importing infrastructure from a component.** A `<ProductGrid>` should never `import { productRepository }`. It receives products as props from a server component or calls a use case via container.
- **Business rules in route handlers or server actions.** Server actions are thin: parse → call use case → return. Pricing, discount, and stock logic stay in `domain/`.
- **`fetch()` inside components.** All data access goes through a use case. The use case may eventually delegate to a fetch-based repository — but the component never knows.
- **Spreading `process.env` reads.** All env vars resolved in `infrastructure/config.ts` with zod, exported as a typed object.
- **One-to-one DTO copies.** If the wire format equals the entity, ship the entity. Introduce a DTO only when transformation is real.
- **A `services/` folder.** Vague by design — every file ends up there. Use `domain/`, `application/use-cases/`, or `infrastructure/<context>/` instead.
- **Cyclic imports across layers.** If `domain/` ever needs something from `application/`, the boundary is wrong — invert it.

---

## 12. Migration from the current state

Match this onto `NEXTJS_MIGRATION_PLAN.md`. Where the migration plan says "move X to Y", this layout tells you which layer Y lives in.

| Today (`App.tsx`) | Target layer | Target file |
|---|---|---|
| `interface CartItem` (line 13) | domain | `src/domain/cart/cart.ts` |
| `addToCart` (line 36) | domain (operation) + application (use case) | `cart.operations.ts` + `use-cases/add-to-cart.ts` |
| `featuredProducts`, `freshLonganProducts`, `driedLonganProducts` arrays (lines 129–369) | infrastructure | `src/infrastructure/products/data/products.json` |
| `handleProductClick` (line 76) | gone — replaced by `<Link href>` | presentation |
| `navigateToPage` (line 91) | gone — replaced by `<Link href>` | presentation |
| Inline JSON-LD (lines 397–436) | presentation | `src/components/seo/OrganizationJsonLd.tsx` (rendered in `app/layout.tsx`) |
| `react-helmet-async` `<Helmet>` (lines 374–437) | gone — replaced by Next `metadata` exports | presentation |
| `LoginModal` mock auth | application + infrastructure (port: `AuthSession`, adapter: `mock-auth-session.ts`) | parked until real auth |

Phase order from the migration plan, annotated with layer touchpoints:

1. **Phase 0** lands `domain/product/product.ts` + `infrastructure/products/in-memory-product-repository.ts` (extract data) — does not require Next.js yet.
2. **Phase 1-2** introduces `app/` (presentation) on top of the existing domain + infrastructure.
3. **Phase 3** adds `domain/cart/` + `infrastructure/cart/local-storage-cart.ts` + cart provider in presentation.
4. **Phase 4** adds `components/seo/` JSON-LD components (presentation).
5. Future work (contact email, real auth, orders) slots in as new ports + adapters without disturbing what exists.

---

## 13. One-page mental model

> **Domain says what is true. Application says what to do. Infrastructure says how. Presentation shows it.**

Read code in that order. Write code in that order. Tests get easier in that order. When in doubt about where something belongs, ask which sentence above it answers.
