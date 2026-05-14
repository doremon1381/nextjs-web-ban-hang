'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Trash2, Plus } from 'lucide-react'
import type { Product, ProductVariant } from '@/types/database'

interface VariantRow {
  Id?: string
  Name: string
  Price: number | ''
  Stock: number | ''
}

interface ProductFormProps {
  product?: Product
  variants?: ProductVariant[]
  action: (formData: FormData) => Promise<void>
  submitLabel: string
}

export function ProductForm({ product, variants: initialVariants = [], action, submitLabel }: ProductFormProps) {
  const [isActive, setIsActive] = useState(product?.IsActive ?? true)
  const [variantRows, setVariantRows] = useState<VariantRow[]>(
    initialVariants.length > 0
      ? initialVariants.map((v) => ({ Id: v.Id, Name: v.Name, Price: v.Price, Stock: v.Stock }))
      : [{ Name: '', Price: '', Stock: '' }]
  )
  const [images, setImages] = useState<string>((product?.Images ?? []).join('\n'))

  function addVariant() {
    setVariantRows((rows) => [...rows, { Name: '', Price: '', Stock: '' }])
  }

  function removeVariant(i: number) {
    setVariantRows((rows) => rows.filter((_, idx) => idx !== i))
  }

  function updateVariant(i: number, field: keyof VariantRow, value: string) {
    setVariantRows((rows) =>
      rows.map((row, idx) =>
        idx === i
          ? { ...row, [field]: field === 'Name' ? value : value === '' ? '' : Number(value) }
          : row
      )
    )
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="IsActive" value={String(isActive)} />
      <input type="hidden" name="Variants" value={JSON.stringify(variantRows)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="Name">Tên sản phẩm *</Label>
          <Input id="Name" name="Name" defaultValue={product?.Name ?? ''} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="Category">Danh mục</Label>
          <Input id="Category" name="Category" defaultValue={product?.Category ?? ''} placeholder="vd: nhan-tuoi" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="Description">Mô tả ngắn</Label>
        <Textarea id="Description" name="Description" defaultValue={product?.Description ?? ''} rows={2} className="resize-none" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="FullDescription">Mô tả đầy đủ</Label>
        <Textarea id="FullDescription" name="FullDescription" defaultValue={product?.FullDescription ?? ''} rows={5} className="resize-none" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="Images">Ảnh sản phẩm (mỗi URL một dòng)</Label>
        <Textarea
          id="Images"
          name="Images"
          value={images}
          onChange={(e) => setImages(e.target.value)}
          rows={4}
          className="resize-none font-mono text-xs"
          placeholder="https://..."
        />
      </div>

      {/* Variants */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Biến thể sản phẩm</Label>
          <button type="button" onClick={addVariant} className="flex items-center gap-1 text-sm text-[#2E7D32] hover:underline">
            <Plus className="w-3.5 h-3.5" />
            Thêm biến thể
          </button>
        </div>
        <div className="space-y-2">
          {variantRows.map((v, i) => (
            <div key={i} className="flex items-center gap-3">
              <Input
                placeholder="Tên biến thể (vd: 1kg)"
                value={v.Name}
                onChange={(e) => updateVariant(i, 'Name', e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Giá (₫)"
                value={v.Price}
                onChange={(e) => updateVariant(i, 'Price', e.target.value)}
                className="w-32"
                min={0}
              />
              <Input
                type="number"
                placeholder="Tồn kho"
                value={v.Stock}
                onChange={(e) => updateVariant(i, 'Stock', e.target.value)}
                className="w-24"
                min={0}
              />
              <button
                type="button"
                onClick={() => removeVariant(i)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                disabled={variantRows.length === 1}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active toggle */}
      <div className="flex items-center gap-3">
        <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
        <Label htmlFor="active">Hiển thị sản phẩm</Label>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" className="bg-[#2E7D32] hover:bg-[#1B5E20]">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
