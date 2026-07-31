'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, ArrowRight, Phone, MapPin, Calendar, Clock, RefreshCw } from 'lucide-react'

interface OrderItem {
  id: string
  name?: string
  title?: string
  price: number
  quantity: number
}

interface Order {
  id: string
  customerName: string
  customerPhone: string
  city: string
  address: string
  notes: string
  items: string
  totalAmount: number
  status: string
  createdAt: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      if (data.success) {
        setOrders(data.orders)
      }
    } catch (e) {
      console.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* العناوين والتنقل */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <ArrowRight className="w-5 h-5 text-gray-700" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-gray-900">إدارة الطلبات الواردة</h1>
              <p className="text-xs text-gray-500 mt-1">عرض ومتابعة كافة طلبات الزبائن</p>
            </div>
          </div>

          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> تحديث الطلبات
          </button>
        </div>

        {/* عرض الطلبات */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">جاري تحميل الطلبات...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">لا توجد طلبات واردة حالياً</h3>
            <p className="text-sm text-gray-500 mt-1">أي طلب يقوم به الزبون يظهر هنا فوراً.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              let parsedItems: OrderItem[] = []
              try {
                parsedItems = JSON.parse(order.items)
              } catch (e) {
                parsedItems = []
              }

              return (
                <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                  {/* شريط رأس الطلب */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-black text-white font-mono text-sm font-bold rounded-lg">
                        {order.id}
                      </span>
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                        {order.status || 'جديد'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(order.createdAt).toLocaleDateString('ar-JO')}</span>
                      <Clock className="w-3.5 h-3.5 mr-2" />
                      <span>{new Date(order.createdAt).toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* معلومات الزبون والمنتجات */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* معلومات الزبون */}
                    <div className="space-y-2 text-sm border-l border-gray-100 pl-4">
                      <h4 className="font-bold text-gray-900 border-b border-gray-50 pb-1 mb-2">بيانات الزبون:</h4>
                      <p className="font-bold text-black text-base">{order.customerName}</p>
                      <p className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <a href={`tel:${order.customerPhone}`} className="hover:underline font-mono">{order.customerPhone}</a>
                      </p>
                      <p className="flex items-start gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        <span>{order.city} - {order.address}</span>
                      </p>
                      {order.notes && (
                        <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg mt-2">
                          <strong>ملاحظة:</strong> {order.notes}
                        </p>
                      )}
                    </div>

                    {/* قائمة المنتجات المطلوبة */}
                    <div className="md:col-span-2 space-y-2">
                      <h4 className="font-bold text-gray-900 border-b border-gray-50 pb-1 mb-2 text-sm">المنتجات المطلوبة:</h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {parsedItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="font-bold text-gray-800">
                              {item.title || item.name || 'منتج'} <span className="text-gray-500 font-normal">(x{item.quantity})</span>
                            </span>
                            <span className="font-bold text-black">{item.price * item.quantity} JOD</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-3 font-bold">
                        <span className="text-gray-700 text-sm">الإجمالي الكلي:</span>
                        <span className="text-lg font-black text-emerald-600">{order.totalAmount} JOD</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}