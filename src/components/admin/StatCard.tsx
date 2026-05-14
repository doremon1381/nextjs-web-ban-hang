import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  highlight?: 'default' | 'warning' | 'success'
}

export function StatCard({ title, value, icon: Icon, description, highlight = 'default' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
      <div
        className={cn('p-2.5 rounded-lg', {
          'bg-[#E8F5E9] text-[#2E7D32]': highlight === 'success',
          'bg-amber-50 text-amber-600': highlight === 'warning',
          'bg-blue-50 text-blue-600': highlight === 'default',
        })}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 mt-0.5">{value}</p>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </div>
    </div>
  )
}
