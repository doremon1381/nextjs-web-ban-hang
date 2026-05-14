import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Cài đặt | Admin' }

export default function AdminSettingsPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-gray-900">Cài đặt</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
        Trang cài đặt đang được phát triển.
      </div>
    </div>
  )
}
