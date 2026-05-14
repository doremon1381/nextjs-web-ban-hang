'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { OrderStatus, PaymentStatus } from '@/types/database'

async function requireAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Forbidden')
  const { data } = await supabase.from('app_users').select('Role').eq('Id', user.id).single()
  if (data?.Role !== 'Admin') throw new Error('Forbidden')
  return { supabase, userId: user.id }
}

export async function updateOrderStatus(
  orderId: string,
  nextStatus: OrderStatus,
  reason?: string
) {
  const { supabase } = await requireAdmin()

  const { error: updateErr } = await supabase
    .from('Orders')
    .update({ Status: nextStatus, UpdatedAt: new Date().toISOString() })
    .eq('Id', orderId)

  if (updateErr) throw new Error(updateErr.message)

  const { error: histErr } = await supabase
    .from('OrderStatusHistories')
    .insert({ OrderId: orderId, Status: nextStatus, Reason: reason ?? null })

  if (histErr) throw new Error(histErr.message)

  revalidatePath(`/admin/don-hang/${orderId}`)
  revalidatePath('/admin/don-hang')
}

export async function updatePaymentStatus(orderId: string, status: PaymentStatus) {
  const { supabase } = await requireAdmin()

  const { error } = await supabase
    .from('Orders')
    .update({ PaymentStatus: status, UpdatedAt: new Date().toISOString() })
    .eq('Id', orderId)

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/don-hang/${orderId}`)
  revalidatePath('/admin/don-hang')
}
