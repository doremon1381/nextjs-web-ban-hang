import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '../ProductForm'
import { updateProduct } from '../actions'

export const metadata: Metadata = { title: 'Chỉnh sửa sản phẩm | Admin' }

interface PageProps {
  params: { id: string }
}

export default async function EditProductPage({ params }: PageProps) {
  const supabase = createClient()

  const [productRes, variantsRes] = await Promise.all([
    supabase.from('Products').select('*').eq('Id', params.id).single(),
    supabase.from('ProductVariants').select('*').eq('ProductId', params.id).order('CreatedAt'),
  ])

  if (!productRes.data) notFound()

  const product = productRes.data
  const variants = variantsRes.data ?? []

  const boundAction = updateProduct.bind(null, params.id)

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-2">
        <Link href="/admin/san-pham" className="text-sm text-gray-400 hover:text-gray-600">
          ← Sản phẩm
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{product.Name}</h1>
        <a
          href={`/san-pham/${product.Slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#2E7D32] hover:underline"
        >
          Xem trang ↗
        </a>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ProductForm
          product={product}
          variants={variants}
          action={boundAction}
          submitLabel="Lưu thay đổi"
        />
      </div>
    </div>
  )
}
