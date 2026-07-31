'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Trash2, Loader2, Eye } from 'lucide-react'

interface Product {
  id: string
  title: string
  price: number
  description: string
  categorySlug: string
  imageUrl: string
}

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm(`هل أنت تأكد من حذف المنتج "${product.title}"؟`)) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
      })
      const result = await res.json()
      if (result.success) {
        router.refresh()
      } else {
        alert('حدث خطأ أثناء الحذف')
      }
    } catch (e) {
      alert('تعذر الاتصال بالخادم')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between relative">
      {/* زر الحذف */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        title="حذف المنتج"
        className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur p-2 rounded-xl text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-gray-200"
      >
        {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>

      <Link href={`/product/${product.id}`} className="block flex-1">
        {/* صورة المنتج */}
        <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ShoppingBag className="w-10 h-10" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold text-black flex items-center gap-1 shadow-lg">
              <Eye className="w-3.5 h-3.5" /> معاينة التفاصيل
            </span>
          </div>
        </div>

        {/* تفاصيل المنتج */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-black line-clamp-1">
            {product.title}
          </h3>
          {product.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
      </Link>

      {/* السعر وزر الإضافة */}
      <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-50 mt-2">
        <span className="text-xl font-black text-black">
          {product.price} <span className="text-xs font-normal">JOD</span>
        </span>
        <Link
          href={`/product/${product.id}`}
          className="p-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}