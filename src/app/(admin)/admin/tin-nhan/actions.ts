'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Forbidden')
  const { data } = await supabase.from('app_users').select('Role').eq('Id', user.id).single()
  if (data?.Role !== 'Admin') throw new Error('Forbidden')
  return supabase
}

export async function markMessageRead(messageId: string, isRead: boolean) {
  const supabase = await requireAdmin()
  const { error } = await supabase
    .from('ContactMessages')
    .update({ IsRead: isRead })
    .eq('Id', messageId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/tin-nhan')
  revalidatePath('/admin')
}
