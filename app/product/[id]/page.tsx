import Database from 'better-sqlite3'
import path from 'path'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react'
import AddToCartButton from '@/components/AddToCartButton'

interface Product {
  id: string
  title: string
  price: number
  description: string
  categorySlug: string
  imageUrl: string
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // جلب بيانات المنتج المباشر من قاعدة البيانات
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
  const db = new Database(dbPath)

  let product: Product | null = null
  try {
    const stmt = db.prepare('SELECT * FROM Product WHERE id = ?')
    product = stmt.get(id) as Product | null
  } catch (e) {
    product = null
  }

  if (!product) {
    notFound()
  }

  const categoryNames: Record<string, string> = {
    'beaded-bracelets': 'أساور خرزية',
    accessories: 'إكسسوارات',
    't-shirts': 'تيشيرتات',
    hoodies: 'هوديات',
  }

  const categoryTitle = categoryNames[product.categorySlug] || 'المنتجات'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* شريط المسار العلوي */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 border-b border-gray-100 pb-4">
        <Link href="/" className="hover:text-black transition-colors">
          الرئيسية
        </Link>
        <span>/</span>
        <Link
          href={`/category/${product.categorySlug}`}
          className="hover:text-black transition-colors"
        >
          {categoryTitle}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-bold truncate">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* صورة المنتج */}
        <div className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-200 aspect-square flex items-center justify-center relative group">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <ShoppingBag className="w-16 h-16 mb-2" />
              <span>لا توجد صورة للمنتج</span>
            </div>
          )}
        </div>

        {/* معلومات المنتج */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full mb-3">
              {categoryTitle}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
              {product.title}
            </h1>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-black">{product.price}</span>
              <span className="text-base font-bold text-gray-500">JOD</span>
            </div>
          </div>

          <div className="border-t border-b border-gray-200 py-6 my-2">
            <h3 className="text-sm font-bold text-gray-900 mb-2">وصف المنتج:</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {product.description || 'لا يوجد وصف متاح لهذا المنتج حالياً.'}
            </p>
          </div>

          {/* زر إضافة إلى السلة التفاعلي */}
          <div className="space-y-3 pt-2">
            <AddToCartButton
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                imageUrl: product.imageUrl,
              }}
            />
          </div>

          {/* الضمانات والتوصيل */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 text-center">
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center">
              <Truck className="w-5 h-5 text-gray-700 mb-1" />
              <span className="text-xs font-bold text-gray-800">توصيل سريع</span>
              <span className="text-[10px] text-gray-500">لكافة المحافظات</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center">
              <ShieldCheck className="w-5 h-5 text-gray-700 mb-1" />
              <span className="text-xs font-bold text-gray-800">جودة مضمونة</span>
              <span className="text-[10px] text-gray-500">خامات عالية</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center">
              <RefreshCw className="w-5 h-5 text-gray-700 mb-1" />
              <span className="text-xs font-bold text-gray-800">دفع عند الاستلام</span>
              <span className="text-[10px] text-gray-500">معاينة القطعة</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}