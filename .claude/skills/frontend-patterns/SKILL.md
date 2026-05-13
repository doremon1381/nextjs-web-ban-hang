---
name: frontend-patterns
description: Frontend patterns for this Next.js 14+ App Router commerce site (nhãn lồng / longan fruit). Covers Server vs Client Components, data fetching, state, forms (react-hook-form + Zod), Radix UI / shadcn, performance, and accessibility.
origin: custom
---

# Frontend Development Patterns

Modern frontend patterns for this project's Next.js 14+ App Router stack (React 18, Tailwind v4, Radix UI / shadcn, react-hook-form, motion/framer, lucide-react, sonner).

## When to Activate

- Building React components (composition, props, rendering)
- Deciding Server vs Client Components and where data fetching belongs
- Managing state (useState, useReducer, Context, light client stores)
- Working with forms (react-hook-form + Zod schemas)
- Optimizing performance (memoization, dynamic imports, next/image)
- Handling routing and navigation with the App Router
- Building accessible, responsive UI patterns on top of Radix primitives

## Component Patterns

### Composition Over Inheritance

```typescript
// PASS: GOOD: Component composition
interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'outlined'
}

export function Card({ children, variant = 'default' }: CardProps) {
  return <div className={`card card-${variant}`}>{children}</div>
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="card-header">{children}</div>
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="card-body">{children}</div>
}

// Usage
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
</Card>
```

### Compound Components

```typescript
interface TabsContextValue {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

export function Tabs({ children, defaultTab }: {
  children: React.ReactNode
  defaultTab: string
}) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  )
}

export function TabList({ children }: { children: React.ReactNode }) {
  return <div className="tab-list">{children}</div>
}

export function Tab({ id, children }: { id: string, children: React.ReactNode }) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('Tab must be used within Tabs')

  return (
    <button
      className={context.activeTab === id ? 'active' : ''}
      onClick={() => context.setActiveTab(id)}
    >
      {children}
    </button>
  )
}

// Usage
<Tabs defaultTab="overview">
  <TabList>
    <Tab id="overview">Overview</Tab>
    <Tab id="details">Details</Tab>
  </TabList>
</Tabs>
```

### Server Component Data Fetching (preferred in App Router)

```typescript
// app/products/page.tsx — Server Component, no 'use client'
import { ProductGrid } from '@/components/product/ProductGrid'

export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductGrid products={products} />
}

// Streaming with Suspense for slower sections
import { Suspense } from 'react'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedProducts /> {/* async Server Component */}
      </Suspense>
    </>
  )
}
```

### Render Props (use sparingly — prefer hooks)

```typescript
'use client'
interface DataLoaderProps<T> {
  url: string
  children: (data: T | null, loading: boolean, error: Error | null) => React.ReactNode
}

export function DataLoader<T>({ url, children }: DataLoaderProps<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [url])

  return <>{children(data, loading, error)}</>
}

// Usage
<DataLoader<Product[]> url="/api/products">
  {(products, loading, error) => {
    if (loading) return <Spinner />
    if (error) return <ErrorState error={error} />
    return <ProductList products={products!} />
  }}
</DataLoader>
```

## Custom Hooks Patterns

### State Management Hook

```typescript
export function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue(v => !v)
  }, [])

  return [value, toggle]
}

// Usage
const [isOpen, toggleOpen] = useToggle()
```

### Async Data Fetching Hook (client-side)

Prefer fetching in Server Components. Use this only when you need client-side fetching (e.g. for cart sync, account dashboards).

```typescript
'use client'
interface UseQueryOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  enabled?: boolean
}

export function useQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: UseQueryOptions<T>
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await fetcher()
      setData(result)
      options?.onSuccess?.(result)
    } catch (err) {
      const error = err as Error
      setError(error)
      options?.onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [fetcher, options])

  useEffect(() => {
    if (options?.enabled !== false) {
      refetch()
    }
  }, [key, refetch, options?.enabled])

  return { data, error, loading, refetch }
}

// Usage — fetching current user's orders from a Client Component
const { data: orders, loading, error, refetch } = useQuery(
  'orders',
  () => fetch('/api/orders/me').then(r => r.json()),
  {
    onSuccess: data => console.log('Fetched', data.length, 'orders'),
    onError: err => console.error('Failed:', err)
  }
)
```

### Debounce Hook

```typescript
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
const [searchQuery, setSearchQuery] = useState('')
const debouncedQuery = useDebounce(searchQuery, 500)

useEffect(() => {
  if (debouncedQuery) {
    performSearch(debouncedQuery)
  }
}, [debouncedQuery])
```

## State Management Patterns

### Context + Reducer Pattern

```typescript
'use client'
interface CartItem {
  productId: string
  name: string
  priceVnd: number
  quantity: number
}

interface State {
  items: CartItem[]
  isOpen: boolean
}

type Action =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'SET_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'CLEAR' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.productId === action.payload.productId)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.productId === existing.productId
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          )
        }
      }
      return { ...state, items: [...state.items, action.payload] }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.productId !== action.payload.productId)
      }
    case 'SET_QUANTITY':
      return {
        ...state,
        items: state.items.map(i =>
          i.productId === action.payload.productId
            ? { ...i, quantity: action.payload.quantity }
            : i
        )
      }
    case 'OPEN': return { ...state, isOpen: true }
    case 'CLOSE': return { ...state, isOpen: false }
    case 'CLEAR': return { ...state, items: [] }
    default: return state
  }
}

const CartContext = createContext<{
  state: State
  dispatch: Dispatch<Action>
} | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], isOpen: false })
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
```

## Performance Optimization

### Memoization

```typescript
// PASS: useMemo for expensive computations
const sortedProducts = useMemo(() => {
  return [...products].sort((a, b) => a.priceVnd - b.priceVnd)
}, [products])

// PASS: useCallback for functions passed to children
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])

// PASS: React.memo for pure components
export const ProductCard = React.memo<ProductCardProps>(({ product }) => {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{formatCurrencyVnd(product.priceVnd)}</p>
    </div>
  )
})
```

### Code Splitting & Lazy Loading (next/dynamic)

```typescript
import dynamic from 'next/dynamic'

// PASS: client-only modal — disable SSR
const CartModal = dynamic(() => import('@/components/cart/CartModal'), {
  ssr: false,
  loading: () => null
})

// PASS: heavy chart on the orders/dashboard page
const SalesChart = dynamic(() => import('@/components/account/SalesChart'), {
  loading: () => <ChartSkeleton />
})
```

### Images (next/image)

```typescript
import Image from 'next/image'

export function ProductCard({ product }: { product: Product }) {
  return (
    <article>
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={600}
        height={600}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />
      <h3>{product.name}</h3>
    </article>
  )
}
```

## Form Handling Patterns

### react-hook-form + Zod (preferred — this project uses `react-hook-form` 7.55)

```typescript
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

const CheckoutSchema = z.object({
  fullName: z.string().min(1, 'Vui lòng nhập họ tên').max(120),
  phone: z.string().regex(/^(0|\+84)\d{9}$/, 'Số điện thoại không hợp lệ'),
  province: z.string().min(1, 'Chọn tỉnh/thành'),
  district: z.string().min(1, 'Chọn quận/huyện'),
  addressLine: z.string().min(1, 'Nhập địa chỉ chi tiết').max(200),
  note: z.string().max(500).optional()
})
type CheckoutForm = z.infer<typeof CheckoutSchema>

export function CheckoutForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<CheckoutForm>({ resolver: zodResolver(CheckoutSchema) })

  const onSubmit = async (data: CheckoutForm) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('Đặt hàng thất bại')
      toast.success('Đặt hàng thành công! Chúng tôi sẽ liên hệ sớm.')
    } catch (err) {
      toast.error((err as Error).message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input {...register('fullName')} placeholder="Họ và tên" />
        {errors.fullName && <span className="text-red-600">{errors.fullName.message}</span>}
      </div>
      <div>
        <input {...register('phone')} placeholder="Số điện thoại" />
        {errors.phone && <span className="text-red-600">{errors.phone.message}</span>}
      </div>
      {/* ...other fields... */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
      </button>
    </form>
  )
}
```

## Error Boundary Pattern

```typescript
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

## Animation Patterns

### Motion / Framer Motion (`motion` package, this project uses 12.x)

```typescript
'use client'
import { motion, AnimatePresence } from 'motion/react'

// PASS: List animations
export function AnimatedProductList({ products }: { products: Product[] }) {
  return (
    <AnimatePresence>
      {products.map(product => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

// PASS: Modal animations
export function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

## Accessibility Patterns

### Keyboard Navigation

```typescript
export function Dropdown({ options, onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(i => Math.min(i + 1, options.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(i => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        onSelect(options[activeIndex])
        setIsOpen(false)
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  return (
    <div
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      onKeyDown={handleKeyDown}
    >
      {/* Dropdown implementation */}
    </div>
  )
}
```

### Focus Management

```typescript
export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Save currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement

      // Focus modal
      modalRef.current?.focus()
    } else {
      // Restore focus when closing
      previousFocusRef.current?.focus()
    }
  }, [isOpen])

  return isOpen ? (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onKeyDown={e => e.key === 'Escape' && onClose()}
    >
      {children}
    </div>
  ) : null
}
```

**Remember**: Modern frontend patterns enable maintainable, performant user interfaces. Choose patterns that fit your project complexity.
