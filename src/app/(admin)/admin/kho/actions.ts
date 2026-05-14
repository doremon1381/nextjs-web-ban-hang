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

export async function updateVariantStock(variantId: string, stock: number) {
  const supabase = await requireAdmin()
  const { error } = await supabase
    .from('ProductVariants')
    .update({ Stock: stock })
    .eq('Id', variantId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/kho')
  revalidatePath('/admin')
}
