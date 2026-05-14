import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/admin/StatCard'
import { ShoppingBag, TrendingUp, AlertTriangle, MessageSquare } from 'lucide-react'

export const metadata: Metadata = { title: 'Tổng quan | Admin' }

const LOW_STOCK_THRESHOLD = 10

export default async function AdminDashboardPage() {
  const supabase = createClient()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const sevenDaysAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)

  const [ordersToday, revenue7d, lowStock, unreadMessages] = await Promise.all([
    supabase
      .from('Orders')
      .select('Id', { count: 'exact', head: true })
      .gte('CreatedAt', today.toISOString()),

    supabase
      .from('Orders')
      .select('TotalAmount')
      .gte('CreatedAt', sevenDaysAgo.toISOString())
      .neq('Status', 'Cancelled'),

    supabase
      .from('ProductVariants')
      .select('Id', { count: 'exact', head: true })
      .lt('Stock', LOW_STOCK_THRESHOLD),

    supabase
      .from('ContactMessages')
      .select('Id', { count: 'exact', head: true })
      .eq('IsRead', false),
  ])

  const totalRevenue = (revenue7d.data ?? []).reduce((sum, o) => sum + (o.TotalAmount ?? 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Tổng quan</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {today.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Đơn hàng hôm nay"
          value={ordersToday.count ?? 0}
          icon={ShoppingBag}
          highlight="default"
        />
        <StatCard
          title="Doanh thu 7 ngày"
          value={totalRevenue.toLocaleString('vi-VN') + ' ₫'}
          icon={TrendingUp}
          highlight="success"
        />
        <StatCard
          title="Sản phẩm sắp hết"
          value={lowStock.count ?? 0}
          icon={AlertTriangle}
          description={`Dưới ${LOW_STOCK_THRESHOLD} sản phẩm`}
          highlight={(lowStock.count ?? 0) > 0 ? 'warning' : 'default'}
        />
        <StatCard
          title="Tin nhắn chưa đọc"
          value={unreadMessages.count ?? 0}
          icon={MessageSquare}
          highlight={(unreadMessages.count ?? 0) > 0 ? 'warning' : 'default'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders supabase={supabase} />
        <RecentMessages supabase={supabase} />
      </div>
    </div>
  )
}

async function RecentOrders({ supabase }: { supabase: ReturnType<typeof createClient> }) {
  const { data: orders } = await supabase
    .from('Orders')
    .select('Id, Status, TotalAmount, CreatedAt')
    .order('CreatedAt', { ascending: false })
    .limit(5)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-semibold text-gray-800 mb-4">Đơn hàng gần đây</h2>
      {!orders?.length ? (
        <p className="text-sm text-gray-400">Chưa có đơn hàng</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {orders.map((o) => (
            <li key={o.Id} className="py-3 flex items-center justify-between text-sm">
              <div>
                <span className="font-medium text-gray-700">#{o.Id.slice(0, 8).toUpperCase()}</span>
                <span className="ml-2 text-gray-400 text-xs">
                  {new Date(o.CreatedAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-600">{(o.TotalAmount ?? 0).toLocaleString('vi-VN')} ₫</span>
                <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">{o.Status}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

async function RecentMessages({ supabase }: { supabase: ReturnType<typeof createClient> }) {
  const { data: messages } = await supabase
    .from('ContactMessages')
    .select('Id, Name, Message, IsRead, CreatedAt')
    .order('CreatedAt', { ascending: false })
    .limit(5)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-semibold text-gray-800 mb-4">Tin nhắn gần đây</h2>
      {!messages?.length ? (
        <p className="text-sm text-gray-400">Chưa có tin nhắn</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {messages.map((m) => (
            <li key={m.Id} className="py-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${m.IsRead ? 'text-gray-500' : 'text-gray-900'}`}>{m.Name}</span>
                {!m.IsRead && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{m.Message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
