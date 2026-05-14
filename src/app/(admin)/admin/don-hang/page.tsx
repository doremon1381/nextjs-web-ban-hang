import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/admin/StatusBadge'
import type { Order, OrderStatus } from '@/types/database'

export const metadata: Metadata = { title: 'Đơn hàng | Admin' }

const STATUS_TABS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all',       label: 'Tất cả' },
  { value: 'Pending',   label: 'Chờ xác nhận' },
  { value: 'Confirmed', label: 'Đã xác nhận' },
  { value: 'Shipping',  label: 'Đang giao' },
  { value: 'Completed', label: 'Hoàn thành' },
  { value: 'Cancelled', label: 'Đã huỷ' },
]

interface PageProps {
  searchParams: { status?: string; page?: string }
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const supabase = createClient()
  const activeStatus = searchParams.status ?? 'all'
  const page = Math.max(0, parseInt(searchParams.page ?? '0', 10))
  const PAGE_SIZE = 25

  let query = supabase
    .from('Orders')
    .select(
      'Id, Status, PaymentMethod, PaymentStatus, TotalAmount, CreatedAt, UserId',
      { count: 'exact' }
    )
    .order('CreatedAt', { ascending: false })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

  if (activeStatus !== 'all') {
    query = query.eq('Status', activeStatus)
  }

  const { data: orders, count } = await query
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-gray-900">Đơn hàng</h1>

      {/* Status tabs */}
      <div className="flex gap-1 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/admin/don-hang?status=${tab.value}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeStatus === tab.value
                ? 'bg-[#1F5E3B] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Mã đơn</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Ngày đặt</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Trạng thái</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Thanh toán</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Tổng tiền</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!orders?.length ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400">
                  Không có đơn hàng
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.Id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">
                    #{order.Id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(order.CreatedAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.Status as Order['Status']} />
                  </td>
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={(order.PaymentStatus ?? 'Unpaid') as Order['PaymentStatus']} />
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-800">
                    {(order.TotalAmount ?? 0).toLocaleString('vi-VN')} ₫
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/don-hang/${order.Id}`}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{count} đơn hàng</span>
          <div className="flex items-center gap-2">
            {page > 0 && (
              <Link
                href={`/admin/don-hang?status=${activeStatus}&page=${page - 1}`}
                className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50"
              >
                ← Trước
              </Link>
            )}
            <span>Trang {page + 1} / {totalPages}</span>
            {page < totalPages - 1 && (
              <Link
                href={`/admin/don-hang?status=${activeStatus}&page=${page + 1}`}
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
