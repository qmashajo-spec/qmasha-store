import Database from 'better-sqlite3'
import path from 'path'
import Link from 'next/link'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import ProductCard from '@/components/ProductCard'

interface Product {
  id: string
  title: string
  price: number
  description: string
  categorySlug: string
  imageUrl: string
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
  const db = new Database(dbPath)

  let products: Product[] = []
  try {
    const stmt = db.prepare('SELECT * FROM Product WHERE categorySlug = ?')
    products = stmt.all(slug) as Product[]
  } catch (e) {
    products = []
  }

  const categoryNames: Record<string, string> = {
    'beaded-bracelets': 'أساور خرزية',
    accessories: 'إكسسوارات',
    't-shirts': 'تيشيرتات',
    hoodies: 'هوديات',
  }

  const title = categoryNames[slug] || 'المنتجات'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-black text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            عرض جميع القطع المتوفرة في قسم {title}
          </p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black transition-colors"
        >
          الرئيسية <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800">لا توجد منتجات حالياً في هذا القسم</h3>
          <p className="text-sm text-gray-500 mt-1">يمكنك إضافة منتجات جديدة عبر لوحة التحكم.</p>
          <Link
            href="/admin"
            className="inline-block mt-4 px-6 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors"
          >
            الذهاب للوحة التحكم
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}