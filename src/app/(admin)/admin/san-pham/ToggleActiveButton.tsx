'use client'
import { useTransition } from 'react'
import { toggleProductActive } from './actions'

export function ToggleActiveButton({ productId, isActive }: { productId: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => toggleProductActive(productId, !isActive))}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
        isActive
          ? 'bg-green-100 text-green-700 hover:bg-red-50 hover:text-red-600'
          : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-700'
      } disabled:opacity-50`}
    >
      {isActive ? 'Đang bán' : 'Ẩn'}
    </button>
  )
}
