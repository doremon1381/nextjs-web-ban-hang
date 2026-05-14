import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/admin/StatusBadge'
import { OrderStatusTransition } from './OrderStatusTransition'
import type { Order, OrderStatus } from '@/types/database'

export const metadata: Metadata = { title: 'Chi tiết đơn hàng | Admin' }

interface PageProps {
  params: { id: string }
}

export default async function OrderDetailPage({ params }: PageProps) {
  const supabase = createClient()

  const [orderRes, itemsRes, historyRes] = await Promise.all([
    supabase
      .from('Orders')
      .select('*, app_users(Email, FullName, Phone)')
      .eq('Id', params.id)
      .single(),
    supabase
      .from('OrderItems')
      .select('*')
      .eq('OrderId', params.id)
      .order('Id'),
    supabase
      .from('OrderStatusHistories')
      .select('*')
      .eq('OrderId', params.id)
      .order('CreatedAt', { ascending: false }),
  ])

  if (!orderRes.data) notFound()

  const order = orderRes.data
  const items = itemsRes.data ?? []
  const history = historyRes.data ?? []

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Đơn hàng #{params.id.slice(0, 8).toUpperCase()}
        </h1>
        <OrderStatusBadge status={order.Status as OrderStatus} />
        <PaymentStatusBadge status={(order.PaymentStatus ?? 'Unpaid') as Order['PaymentStatus']} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Customer */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Khách hàng</h2>
          {order.app_users ? (
            <>
              <p className="text-gray-900">{order.app_users.FullName ?? '—'}</p>
              <p className="text-sm text-gray-500">{order.app_users.Email}</p>
              <p className="text-sm text-gray-500">{order.app_users.Phone ?? '—'}</p>
            </>
          ) : (
            <p className="text-sm text-gray-400">Khách vãng lai</p>
          )}
          {order.ShippingAddress && (
            <p className="text-sm text-gray-600 mt-2 border-t border-gray-100 pt-2">
              {order.ShippingAddress}
            </p>
          )}
        </div>

        {/* Payment */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Thanh toán</h2>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Phương thức</span>
            <span className="font-medium">{order.PaymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Trạng thái</span>
            <PaymentStatusBadge status={(order.PaymentStatus ?? 'Unpaid') as Order['PaymentStatus']} />
          </div>
          <div className="flex justify-between text-sm border-t border-gray-100 pt-2 mt-2">
            <span className="text-gray-500 font-medium">Tổng tiền</span>
            <span className="font-bold text-gray-900">{(order.TotalAmount ?? 0).toLocaleString('vi-VN')} ₫</span>
          </div>
        </div>
      </div>

      {/* Order items */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-700">Sản phẩm</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="text-gray-500 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-2">Sản phẩm</th>
              <th className="text-center px-3 py-2">SL</th>
              <th className="text-right px-5 py-2">Đơn giá</th>
              <th className="text-right px-5 py-2">Thành tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.Id}>
                <td className="px-5 py-3">
                  <p className="font-medium text-gray-800">{item.ProductName}</p>
                  {item.VariantName && <p className="text-xs text-gray-400">{item.VariantName}</p>}
                </td>
                <td className="text-center px-3 py-3 text-gray-600">{item.Quantity}</td>
                <td className="text-right px-5 py-3 text-gray-600">{(item.Price ?? 0).toLocaleString('vi-VN')} ₫</td>
                <td className="text-right px-5 py-3 font-medium text-gray-800">
                  {((item.Price ?? 0) * item.Quantity).toLocaleString('vi-VN')} ₫
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Note */}
      {order.Note && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
          <span className="font-medium">Ghi chú: </span>{order.Note}
        </div>
      )}

      {/* Status transition */}
      <OrderStatusTransition
        orderId={params.id}
        currentStatus={order.Status as OrderStatus}
        currentPaymentStatus={(order.PaymentStatus ?? 'Unpaid') as Order['PaymentStatus']}
      />

      {/* Status history */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-700 mb-4">Lịch sử trạng thái</h2>
        {!history.length ? (
          <p className="text-sm text-gray-400">Chưa có lịch sử</p>
        ) : (
          <ol className="relative border-l border-gray-200 space-y-4 ml-3">
            {history.map((h) => (
              <li key={h.Id} className="ml-4">
                <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-[#43A047] border-2 border-white" />
                <div className="flex items-center gap-2">
                  <OrderStatusBadge status={h.Status as OrderStatus} />
                  <span className="text-xs text-gray-400">
                    {new Date(h.CreatedAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                {h.Reason && <p className="text-sm text-gray-500 mt-0.5">{h.Reason}</p>}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
