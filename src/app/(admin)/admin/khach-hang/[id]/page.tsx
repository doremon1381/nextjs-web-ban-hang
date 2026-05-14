import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OrderStatusBadge } from '@/components/admin/StatusBadge'
import type { OrderStatus } from '@/types/database'

export const metadata: Metadata = { title: 'Chi tiết khách hàng | Admin' }

interface PageProps {
  params: { id: string }
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const supabase = createClient()

  const [userRes, ordersRes] = await Promise.all([
    supabase.from('app_users').select('*').eq('Id', params.id).single(),
    supabase
      .from('Orders')
      .select('Id, Status, TotalAmount, CreatedAt')
      .eq('UserId', params.id)
      .order('CreatedAt', { ascending: false }),
  ])

  if (!userRes.data) notFound()

  const user = userRes.data
  const orders = ordersRes.data ?? []
  const totalSpent = orders
    .filter((o) => o.Status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.TotalAmount ?? 0), 0)

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2">
        <Link href="/admin/khach-hang" className="text-sm text-gray-400 hover:text-gray-600">
          ← Khách hàng
        </Link>
      </div>

      <h1 className="text-2xl font-semibold text-gray-900">{user.FullName ?? user.Email}</h1>

      {/* Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-400">Email</p>
          <p className="text-gray-800 font-medium">{user.Email}</p>
        </div>
        <div>
          <p className="text-gray-400">Điện thoại</p>
          <p className="text-gray-800 font-medium">{user.Phone ?? '—'}</p>
        </div>
        <div>
          <p className="text-gray-400">Ngày đăng ký</p>
          <p className="text-gray-800">{new Date(user.CreatedAt).toLocaleDateString('vi-VN')}</p>
        </div>
        <div>
          <p className="text-gray-400">Tổng chi tiêu</p>
          <p className="text-gray-800 font-medium">{totalSpent.toLocaleString('vi-VN')} ₫</p>
        </div>
      </div>

      {/* Orders */}
      <div>
        <h2 className="font-semibold text-gray-700 mb-3">Đơn hàng ({orders.length})</h2>
        {!orders.length ? (
          <p className="text-sm text-gray-400">Chưa có đơn hàng</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-2.5 font-medium text-gray-600">Mã đơn</th>
                  <th className="text-left px-4 py-2.5 font-medium text-gray-600">Ngày đặt</th>
                  <th className="text-left px-4 py-2.5 font-medium text-gray-600">Trạng thái</th>
                  <th className="text-right px-4 py-2.5 font-medium text-gray-600">Tổng tiền</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.Id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">
                      #{o.Id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(o.CreatedAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={o.Status as OrderStatus} />
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-800">
                      {(o.TotalAmount ?? 0).toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/don-hang/${o.Id}`}
                        className="text-[#2E7D32] hover:underline text-xs"
                      >
                        Xem →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
