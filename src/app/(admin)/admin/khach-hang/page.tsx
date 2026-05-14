import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Khách hàng | Admin' }

interface PageProps {
  searchParams: { page?: string; q?: string }
}

export default async function AdminCustomersPage({ searchParams }: PageProps) {
  const supabase = createClient()
  const page = Math.max(0, parseInt(searchParams.page ?? '0', 10))
  const q = searchParams.q ?? ''
  const PAGE_SIZE = 30

  let query = supabase
    .from('app_users')
    .select('Id, Email, FullName, Phone, CreatedAt', { count: 'exact' })
    .eq('Role', 'Customer')
    .order('CreatedAt', { ascending: false })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

  if (q) {
    query = query.or(`Email.ilike.%${q}%,FullName.ilike.%${q}%`)
  }

  const { data: users, count } = await query
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Khách hàng</h1>
        <span className="text-sm text-gray-500">{count ?? 0} khách hàng</span>
      </div>

      {/* Search */}
      <form method="GET" className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Tìm theo tên hoặc email..."
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#43A047]"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#2E7D32] text-white text-sm rounded-lg hover:bg-[#1B5E20] transition-colors"
        >
          Tìm
        </button>
      </form>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Tên</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Điện thoại</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày đăng ký</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!users?.length ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400">
                  Không tìm thấy khách hàng
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.Id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{u.FullName ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{u.Email}</td>
                  <td className="px-4 py-3 text-gray-500">{u.Phone ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(u.CreatedAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/khach-hang/${u.Id}`}
                      className="text-[#2E7D32] hover:underline text-xs font-medium"
                    >
                      Chi tiết →
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
          <span>{count} khách hàng</span>
          <div className="flex items-center gap-2">
            {page > 0 && (
              <Link
                href={`/admin/khach-hang?page=${page - 1}&q=${q}`}
                className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50"
              >
                ← Trước
              </Link>
            )}
            <span>Trang {page + 1} / {totalPages}</span>
            {page < totalPages - 1 && (
              <Link
                href={`/admin/khach-hang?page=${page + 1}&q=${q}`}
                className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50"
              >
                Tiếp →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
