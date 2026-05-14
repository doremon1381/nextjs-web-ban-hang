'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Forbidden')
  const { data } = await supabase.from('app_users').select('Role').eq('Id', user.id).single()
  if (data?.Role !== 'Admin') throw new Error('Forbidden')
  return supabase
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export interface VariantInput {
  Id?: string
  Name: string
  Price: number
  Stock: number
}

export async function createProduct(formData: FormData) {
  const supabase = await requireAdmin()

  const name = formData.get('Name') as string
  const description = formData.get('Description') as string
  const fullDescription = formData.get('FullDescription') as string
  const category = formData.get('Category') as string
  const isActive = formData.get('IsActive') === 'true'
  const imagesRaw = formData.get('Images') as string
  const variantsRaw = formData.get('Variants') as string

  const images = imagesRaw ? imagesRaw.split('\n').map((s) => s.trim()).filter(Boolean) : []
  const variants: VariantInput[] = variantsRaw ? JSON.parse(variantsRaw) : []

  const slug = slugify(name) + '-' + Date.now()

  const { data: product, error } = await supabase
    .from('Products')
    .insert({
      Name: name,
      Slug: slug,
      Description: description || null,
      FullDescription: fullDescription || null,
      Category: category || null,
      IsActive: isActive,
      Images: images.length ? images : null,
    })
    .select('Id')
    .single()

  if (error || !product) throw new Error(error?.message ?? 'Create failed')

  if (variants.length) {
    const { error: varErr } = await supabase.from('ProductVariants').insert(
      variants.map((v) => ({
        ProductId: product.Id,
        Name: v.Name,
        Price: v.Price,
        Stock: v.Stock,
      }))
    )
    if (varErr) throw new Error(varErr.message)
  }

  revalidatePath('/admin/san-pham')
  redirect(`/admin/san-pham/${product.Id}`)
}

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await requireAdmin()

  const name = formData.get('Name') as string
  const description = formData.get('Description') as string
  const fullDescription = formData.get('FullDescription') as string
  const category = formData.get('Category') as string
  const isActive = formData.get('IsActive') === 'true'
  const imagesRaw = formData.get('Images') as string
  const variantsRaw = formData.get('Variants') as string

  const images = imagesRaw ? imagesRaw.split('\n').map((s) => s.trim()).filter(Boolean) : []
  const variants: VariantInput[] = variantsRaw ? JSON.parse(variantsRaw) : []

  const { error } = await supabase
    .from('Products')
    .update({
      Name: name,
      Description: description || null,
      FullDescription: fullDescription || null,
      Category: category || null,
      IsActive: isActive,
      Images: images.length ? images : null,
      UpdatedAt: new Date().toISOString(),
    })
    .eq('Id', productId)

  if (error) throw new Error(error.message)

  // Upsert variants: update existing, insert new
  for (const v of variants) {
    if (v.Id) {
      await supabase
        .from('ProductVariants')
        .update({ Name: v.Name, Price: v.Price, Stock: v.Stock })
        .eq('Id', v.Id)
    } else {
      await supabase.from('ProductVariants').insert({
        ProductId: productId,
        Name: v.Name,
        Price: v.Price,
        Stock: v.Stock,
      })
    }
  }

  revalidatePath(`/admin/san-pham/${productId}`)
  revalidatePath('/admin/san-pham')
  revalidatePath('/admin/kho')
}

export async function deleteVariant(variantId: string, productId: string) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('ProductVariants').delete().eq('Id', variantId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/san-pham/${productId}`)
  revalidatePath('/admin/kho')
}

export async function toggleProductActive(productId: string, isActive: boolean) {
  const supabase = await requireAdmin()
  const { error } = await supabase
    .from('Products')
    .update({ IsActive: isActive, UpdatedAt: new Date().toISOString() })
    .eq('Id', productId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/san-pham')
  revalidatePath(`/admin/san-pham/${productId}`)
}
