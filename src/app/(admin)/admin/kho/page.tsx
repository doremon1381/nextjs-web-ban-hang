import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { InventoryTable } from './InventoryTable'

export const metadata: Metadata = { title: 'Kho hàng | Admin' }

export const LOW_STOCK_THRESHOLD = 10

export default async function AdminInventoryPage() {
  const supabase = createClient()

  const { data: variants } = await supabase
    .from('ProductVariants')
    .select('Id, Name, Stock, Price, ProductId, Products(Name, IsActive)')
    .order('Stock', { ascending: true })

  type ProductInfo = { Name: string; IsActive: boolean }

  const rows = (variants ?? []).map((v) => {
    const p = (v.Products as unknown as ProductInfo | null)
    return {
      Id: v.Id,
      VariantName: v.Name,
      Price: v.Price as number,
      Stock: v.Stock as number,
      ProductId: v.ProductId as string,
      ProductName: p?.Name ?? '—',
      IsActive: p?.IsActive ?? false,
    }
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Kho hàng</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            Sắp hết (dưới {LOW_STOCK_THRESHOLD})
          </span>
        </div>
      </div>
      <InventoryTable rows={rows} threshold={LOW_STOCK_THRESHOLD} />
    </div>
  )
}
