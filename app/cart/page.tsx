'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart()

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">سلة المشتريات فارغة</h2>
        <p className="text-gray-500 mb-8 text-sm">يبدو أنك لم تقم بإضافة أي منتجات للسلة بعد.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors"
        >
          تصفح المنتجات الآن
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-black text-gray-900">سلة المشتريات</h1>
        <button
          onClick={clearCart}
          className="text-sm font-bold text-rose-600 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" /> تفريغ السلة
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* قائمة المنتجات */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingBag className="w-8 h-8 text-gray-400 m-auto mt-6" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm font-black text-black mt-1">{item.price} JOD</p>
                </div>
              </div>

              {/* أزرار الكمية والحذف */}
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-gray-200 rounded-r-xl transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-sm font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-gray-200 rounded-l-xl transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
                  title="حذف"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ملخص الطلب */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-100">
            ملخص الطلب
          </h2>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>مجموع المنتجات:</span>
              <span className="font-bold text-gray-900">{totalPrice.toFixed(2)} JOD</span>
            </div>
            <div className="flex justify-between">
              <span>التوصيل:</span>
              <span className="font-bold text-emerald-600">3.00 JOD (توصيل عادي)</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-black text-black">
              <span>الإجمالي الكلي:</span>
              <span>{(totalPrice + 3).toFixed(2)} JOD</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-base shadow-lg block text-center"
          >
            متابعة الشراء <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}