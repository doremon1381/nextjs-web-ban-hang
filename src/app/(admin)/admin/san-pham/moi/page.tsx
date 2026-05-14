import type { Metadata } from 'next'
import Link from 'next/link'
import { ProductForm } from '../ProductForm'
import { createProduct } from '../actions'

export const metadata: Metadata = { title: 'Thêm sản phẩm | Admin' }

export default function NewProductPage() {
  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-2">
        <Link href="/admin/san-pham" className="text-sm text-gray-400 hover:text-gray-600">
          ← Sản phẩm
        </Link>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900">Thêm sản phẩm mới</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ProductForm action={createProduct} submitLabel="Tạo sản phẩm" />
      </div>
    </div>
  )
}
