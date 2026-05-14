'use client'
import { useState, useTransition } from 'react'
import { updateOrderStatus, updatePaymentStatus } from '../actions'
import type { OrderStatus, PaymentStatus } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  Pending:   ['Confirmed', 'Cancelled'],
  Confirmed: ['Shipping', 'Cancelled'],
  Shipping:  ['Completed', 'Cancelled'],
  Completed: [],
  Cancelled: [],
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  Pending:   'Chờ xác nhận',
  Confirmed: 'Xác nhận đơn',
  Shipping:  'Giao hàng',
  Completed: 'Hoàn thành',
  Cancelled: 'Huỷ đơn',
}

interface OrderStatusTransitionProps {
  orderId: string
  currentStatus: OrderStatus
  currentPaymentStatus: PaymentStatus
}

export function OrderStatusTransition({ orderId, currentStatus, currentPaymentStatus }: OrderStatusTransitionProps) {
  const [reason, setReason] = useState('')
  const [isPending, startTransition] = useTransition()
  const nextStatuses = NEXT_STATUSES[currentStatus]

  if (!nextStatuses.length && currentPaymentStatus === 'Paid') return null

  function handleStatusChange(next: OrderStatus) {
    startTransition(async () => {
      await updateOrderStatus(orderId, next, reason || undefined)
      setReason('')
    })
  }

  function handlePaymentToggle() {
    const next: PaymentStatus = currentPaymentStatus === 'Unpaid' ? 'Paid' : 'Unpaid'
    startTransition(() => updatePaymentStatus(orderId, next))
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h2 className="font-semibold text-gray-700">Thao tác</h2>

      {nextStatuses.length > 0 && (
        <div className="space-y-3">
          <Textarea
            placeholder="Ghi chú lý do (tùy chọn)..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className="resize-none"
          />
          <div className="flex flex-wrap gap-2">
            {nextStatuses.map((next) => (
              <Button
                key={next}
                disabled={isPending}
                variant={next === 'Cancelled' ? 'destructive' : 'default'}
                className={next !== 'Cancelled' ? 'bg-[#2E7D32] hover:bg-[#1B5E20]' : ''}
                onClick={() => handleStatusChange(next)}
              >
                {STATUS_LABELS[next]}
              </Button>
            ))}
          </div>
        </div>
      )}

      {currentPaymentStatus !== 'Paid' && (
        <Button
          variant="outline"
          disabled={isPending}
          onClick={handlePaymentToggle}
          className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
        >
          Đánh dấu đã thanh toán
        </Button>
      )}
    </div>
  )
}
