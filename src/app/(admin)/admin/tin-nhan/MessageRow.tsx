'use client'
import { useTransition } from 'react'
import { markMessageRead } from './actions'

interface Message {
  Id: string
  Name: string
  Email: string | null
  Phone: string | null
  Message: string
  IsRead: boolean
  CreatedAt: string
}

export function MessageRow({ message: m }: { message: Message }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div
      className={`bg-white rounded-xl border p-4 transition-colors ${
        m.IsRead ? 'border-gray-200' : 'border-blue-200 bg-blue-50/30'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {!m.IsRead && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-0.5" />}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-medium ${m.IsRead ? 'text-gray-700' : 'text-gray-900'}`}>{m.Name}</span>
              {m.Email && <span className="text-sm text-gray-400">{m.Email}</span>}
              {m.Phone && <span className="text-sm text-gray-400">{m.Phone}</span>}
            </div>
            <p className="text-sm text-gray-600 mt-1">{m.Message}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-gray-400">
            {new Date(m.CreatedAt).toLocaleDateString('vi-VN')}
          </span>
          <button
            disabled={isPending}
            onClick={() => startTransition(() => markMessageRead(m.Id, !m.IsRead))}
            className="text-xs text-[#2E7D32] hover:underline disabled:opacity-50"
          >
            {m.IsRead ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
          </button>
        </div>
      </div>
    </div>
  )
}
