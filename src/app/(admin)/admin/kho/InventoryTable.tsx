'use client'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { updateVariantStock } from './actions'

interface InventoryRow {
  Id: string
  VariantName: string
  Price: number
  Stock: number
  ProductId: string
  ProductName: string
  IsActive: boolean
}

interface InventoryTableProps {
  rows: InventoryRow[]
  threshold: number
}

export function InventoryTable({ rows, threshold }: InventoryTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<number>(0)
  const [isPending, startTransition] = useTransition()

  function startEdit(row: InventoryRow) {
    setEditingId(row.Id)
    setEditValue(row.Stock)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  function saveEdit(variantId: string) {
    startTransition(async () => {
      await updateVariantStock(variantId, editValue)
      setEditingId(null)
    })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Sản phẩm</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Biến thể</th>
            <th className="text-right px-4 py-3 font-medium text-gray-600">Giá</th>
            <th className="text-right px-4 py-3 font-medium text-gray-600">Tồn kho</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-12 text-gray-400">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.Id}
                className={`hover:bg-gray-50 ${row.Stock < threshold ? 'bg-red-50/50' : ''}`}
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/san-pham/${row.ProductId}`}
                    className="font-medium text-gray-800 hover:text-[#2E7D32]"
                  >
                    {row.ProductName}
                  </Link>
                  {!row.IsActive && (
                    <span className="ml-2 text-xs text-gray-400">(ẩn)</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">{row.VariantName}</td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {row.Price.toLocaleString('vi-VN')} ₫
                </td>
                <td className="px-4 py-3 text-right">
                  {editingId === row.Id ? (
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(Number(e.target.value))}
                      min={0}
                      className="w-20 px-2 py-1 border border-[#43A047] rounded text-right text-sm focus:outline-none"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(row.Id)
                        if (e.key === 'Escape') cancelEdit()
                      }}
                    />
                  ) : (
                    <span
                      className={`font-medium ${row.Stock < threshold ? 'text-red-600' : 'text-gray-800'}`}
                    >
                      {row.Stock}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {editingId === row.Id ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => saveEdit(row.Id)}
                        disabled={isPending}
                        className="text-xs text-[#2E7D32] hover:underline disabled:opacity-50"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        Huỷ
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(row)}
                      className="text-xs text-gray-400 hover:text-[#2E7D32] transition-colors"
                    >
                      Sửa
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
