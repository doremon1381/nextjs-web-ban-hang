import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { MessageRow } from './MessageRow'

export const metadata: Metadata = { title: 'Tin nhắn | Admin' }

export default async function AdminMessagesPage() {
  const supabase = createClient()

  const { data: messages } = await supabase
    .from('ContactMessages')
    .select('*')
    .order('CreatedAt', { ascending: false })

  const unreadCount = (messages ?? []).filter((m) => !m.IsRead).length

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">Tin nhắn</h1>
        {unreadCount > 0 && (
          <span className="bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
            {unreadCount} chưa đọc
          </span>
        )}
      </div>

      <div className="space-y-2">
        {!messages?.length ? (
          <p className="text-gray-400 text-sm">Chưa có tin nhắn nào.</p>
        ) : (
          messages.map((m) => <MessageRow key={m.Id} message={m} />)
        )}
      </div>
    </div>
  )
}
