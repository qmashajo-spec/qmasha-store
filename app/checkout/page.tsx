'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { ShoppingBag, CheckCircle, Truck, ArrowRight, Loader2 } from 'lucide-react'

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart()

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'عمان',
    address: '',
    notes: '',
  })

  const [loading, setLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items: cart,
          totalAmount: totalPrice + 3, // المجموع مع التوصيل
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setOrderSuccess(data.orderId)
        clearCart() // تفريغ السلة بعد نجاح الطلب
      } else {
        setErrorMsg(data.message || 'حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً.')
      }
    } catch (err) {
      setErrorMsg('تعذر الاتصال بالسيرفر. يرجى التأكد من تشغيل المشروع بشكل صحيح.')
    } finally {
      setLoading(false)
    }
  }

  // في حال تم إرسال الطلب بنجاح
  if (orderSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center" dir="rtl">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">تم استلام طلبك بنجاح! 🎉</h1>
        <p className="text-gray-600 mb-4">
          رقم الطلب الخاص بك هو: <span className="font-mono font-bold text-black">{orderSuccess}</span>
        </p>
        <p className="text-sm text-gray-500 mb-8">
          سنقوم بالتواصل معك عبر الهاتف لتأكيد تفاصيل الشحن والتوصيل.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/admin/orders"
            className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors text-sm"
          >
            عرض الطلب في لوحة التحكم
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-100 text-gray-800 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    )
  }

  // إذا كانت السلة فارغة ولم يتم الطلب بعد
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center" dir="rtl">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">سلة الشراء فارغة</h2>
        <p className="text-gray-500 mb-6 text-sm">أضف بعض المنتجات للسلة لتتمكن من إتمام الطلب.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors text-sm"
        >
          <ArrowRight className="w-4 h-4" /> العودة للتسوق
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" dir="rtl">
      <h1 className="text-3xl font-black text-gray-900 mb-8 border-b border-gray-200 pb-4">
        إتمام الطلب الشراء
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* نموذج معلومات الشحن */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
            <Truck className="w-5 h-5" /> معلومات العنوان والشحن
          </h2>

          {errorMsg && (
            <div className="p-3 bg-rose-50 text-rose-700 text-sm font-bold rounded-xl border border-rose-100">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">الاسم الكامل *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="مثال: أحمد العبدالله"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">رقم الهاتف *</label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="07XXXXXXXX"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-black text-sm text-left font-mono"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">المحافظة / المدينة *</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-black text-sm font-bold"
            >
              <option value="عمان">عمان</option>
              <option value="إربد">إربد</option>
              <option value="الزرقاء">الزرقاء</option>
              <option value="البلقاء">البلقاء</option>
              <option value="العقبة">العقبة</option>
              <option value="مأدبا">مأدبا</option>
              <option value="جرش">جرش</option>
              <option value="عجلون">عجلون</option>
              <option value="المفرق">المفرق</option>
              <option value="الكرك">الكرك</option>
              <option value="الطفيلة">الطفيلة</option>
              <option value="معان">معان</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">العنوان بالتفصيل *</label>
            <textarea
              name="address"
              required
              rows={3}
              placeholder="المنطقة، اسم الشارع، رقم العمارة أو معلم قريب..."
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">ملاحظات للطلب (اختياري)</label>
            <input
              type="text"
              name="notes"
              placeholder="مثال: يرجى الاتصال قبل الوصول"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-base shadow-lg disabled:bg-gray-400"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> جاري إرسال الطلب...
              </>
            ) : (
              `تأكيد الشراء (${(totalPrice + 3).toFixed(2)} JOD)`
            )}
          </button>
        </form>

        {/* ملخص السلة */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
          <h2 className="text-xl font-bold text-gray-900 pb-3 border-b border-gray-200">
            ملخص المنتجات
          </h2>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-gray-400 m-auto mt-3" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-sm text-black">{(item.price * item.quantity).toFixed(2)} JOD</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>مجموع المنتجات:</span>
              <span className="font-bold text-gray-900">{totalPrice.toFixed(2)} JOD</span>
            </div>
            <div className="flex justify-between">
              <span>كلفة التوصيل:</span>
              <span className="font-bold text-gray-900">3.00 JOD</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-black text-black">
              <span>المجموع النهائي:</span>
              <span>{(totalPrice + 3).toFixed(2)} JOD</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-xl border border-amber-100">
            💳 <strong>طريقة الدفع:</strong> الدفع نقداً عند الاستلام بعد معاينة الطلب.
          </div>
        </div>
      </div>
    </div>
  )
}