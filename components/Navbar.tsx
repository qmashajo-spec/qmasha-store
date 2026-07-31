'use client'

import Link from 'next/link'
import { ShoppingBag, Search, User } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function Navbar() {
  const { totalItems } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* الأيقونات اليسارية */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-2 text-gray-700 hover:text-black transition-colors">
            <ShoppingBag className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {totalItems}
              </span>
            )}
          </Link>
          <button className="p-2 text-gray-700 hover:text-black transition-colors">
            <User className="w-6 h-6" />
          </button>
          <button className="p-2 text-gray-700 hover:text-black transition-colors">
            <Search className="w-6 h-6" />
          </button>
        </div>

        {/* روابط الأقسام */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-600">
          <Link href="/category/beaded-bracelets" className="hover:text-black transition-colors">
            أساور خرزية
          </Link>
          <Link href="/category/accessories" className="hover:text-black transition-colors">
            إكسسوارات
          </Link>
          <Link href="/category/t-shirts" className="hover:text-black transition-colors">
            تيشيرتات
          </Link>
          <Link href="/category/hoodies" className="hover:text-black transition-colors">
            هوديات
          </Link>
        </nav>

        {/* اللوجو */}
        <Link href="/" className="text-2xl font-black tracking-widest text-black">
          QMASHA
        </Link>
      </div>
    </header>
  )
}