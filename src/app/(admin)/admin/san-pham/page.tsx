import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ToggleActiveButton } from './ToggleActiveButton'

export const metadata: Metadata = { title: 'Sản phẩm | Admin' }

interface PageProps {
  searchParams: { q?: string; active?: string; category?: string; page?: string }
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const supabase = createClient()
  const page = Math.max(0, parseInt(searchParams.page ?? '0', 10))
  const PAGE_SIZE = 25
  const q = searchParams.q ?? ''
  const activeFilter = searchParams.active

  let query = supabase
    .from('Products')
    .select('Id, Name, Slug, Category, IsActive, CreatedAt', { count: 'exact' })
    .order('CreatedAt', { ascending: false })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

  if (q) query = query.ilike('Name', `%${q}%`)
  if (activeFilter === 'true') query = query.eq('IsActive', true)
  if (activeFilter === 'false') query = query.eq('IsActive', false)

  const { data: products, count } = await query
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Sản phẩm</h1>
        <Link
          href="/admin/san-pham/moi"
          className="px-4 py-2 bg-[#2E7D32] text-white text-sm rounded-lg hover:bg-[#1B5E20] transition-colors font-medium"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      {/* Filters */}
      <form method="GET" className="flex gap-2 flex-wrap">
        <input
          name="q"
          defaultValue={q}
          placeholder="Tìm tên sản phẩm..."
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-[#43A047]"
        />
        <select
          name="active"
          defaultValue={activeFilter ?? ''}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="true">Đang bán</option>
          <option value="false">Ẩn</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-[#2E7D32] text-white text-sm rounded-lg hover:bg-[#1B5E20] transition-colors"
        >
          Lọc
        </button>
      </form>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Tên sản phẩm</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Danh mục</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Trạng thái</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!products?.length ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400">
                  Không có sản phẩm
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.Id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{p.Name}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{p.Slug}</td>
                  <td className="px-4 py-3 text-gray-500">{p.Category ?? '—'}</td>
                  <td className="px-4 py-3">
                    <ToggleActiveButton productId={p.Id} isActive={p.IsActive} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/san-pham/${p.Id}`}
                      className="text-[#2E7D32] hover:underline text-xs font-medium"
                    >
                      Chỉnh sửa →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{count} sản phẩm</span>
          <div className="flex items-center gap-2">
            {page > 0 && (
              <Link href={`/admin/san-pham?q=${q}&active=${activeFilter ?? ''}&page=${page - 1}`}
                className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50">
                ← Trước
              </Link>
            )}
            <span>Trang {page + 1} / {totalPages}</span>
            {page < totalPages - 1 && (
              <Link href={`/admin/san-pham?q=${q}&active=${activeFilter ?? ''}&page=${page + 1}`}
                className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50">
                Tiếp →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
