import Link from 'next/link'
import { ArrowLeft, Sparkles, ShoppingBag } from 'lucide-react'

export default function HomePage() {
  const categories = [
    { name: 'أساور خرزية', slug: 'beaded-bracelets', desc: 'أساور مصنوعة يدوياً بتصاميم مميزة', color: 'bg-rose-50 border-rose-100' },
    { name: 'إكسسوارات', slug: 'accessories', desc: 'لمسات أنيقة تكتمل بها إطلالتك', color: 'bg-amber-50 border-amber-100' },
    { name: 'تيشيرتات', slug: 't-shirts', desc: 'قطنيات مريحة وجودة عالية', color: 'bg-blue-50 border-blue-100' },
    { name: 'هوديات', slug: 'hoodies', desc: 'تصاميم عصريّة ودافئة لجميع المواسم', color: 'bg-purple-50 border-purple-100' },
  ]

  return (
    <div className="min-h-screen">
      {/* قسم البطل - Hero Section */}
      <section className="relative bg-black text-white py-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-3xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-sm border border-white/20">
            <Sparkles className="w-3.5 h-3.5" /> تشكيلة متجر قماشة الجديدة
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            الأناقة والجودة في مكان واحد
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl font-light leading-relaxed">
            اكتشف أحدث صيحات الأزياء، الهوديات، والتيشيرتات والإكسسوارات المصممة بعناية لتناسب أسلوبك.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <a
              href="#categories"
              className="px-8 py-3.5 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg"
            >
              تسوق الآن <ArrowLeft className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* قسم التصنيفات - Categories Section */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">اقسام المتجر</h2>
          <p className="text-gray-500 mt-2">اختر القسم الذي يناسب ذوقك واستكشف منتجاتنا</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`group p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${cat.color} flex flex-col justify-between h-48`}
            >
              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-black">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {cat.desc}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-gray-900 group-hover:gap-2 transition-all">
                استكشف المنتجات <ArrowLeft className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}