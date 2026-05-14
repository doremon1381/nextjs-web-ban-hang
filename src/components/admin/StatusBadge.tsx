import { cn } from '@/lib/utils'
import type { OrderStatus, PaymentStatus } from '@/types/database'

const orderStatusConfig: Record<OrderStatus, { label: string; className: string }> = {
  Pending:   { label: 'Chờ xác nhận', className: 'bg-yellow-100 text-yellow-700' },
  Confirmed: { label: 'Đã xác nhận',  className: 'bg-blue-100 text-blue-700' },
  Shipping:  { label: 'Đang giao',    className: 'bg-indigo-100 text-indigo-700' },
  Completed: { label: 'Hoàn thành',   className: 'bg-green-100 text-green-700' },
  Cancelled: { label: 'Đã huỷ',       className: 'bg-red-100 text-red-700' },
}

const paymentStatusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  Unpaid: { label: 'Chưa thanh toán', className: 'bg-orange-100 text-orange-700' },
  Paid:   { label: 'Đã thanh toán',   className: 'bg-emerald-100 text-emerald-700' },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = orderStatusConfig[status] ?? { label: status, className: 'bg-gray-100 text-gray-600' }
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', config.className)}>
      {config.label}
    </span>
  )
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config = paymentStatusConfig[status] ?? { label: status, className: 'bg-gray-100 text-gray-600' }
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', config.className)}>
      {config.label}
    </span>
  )
}
