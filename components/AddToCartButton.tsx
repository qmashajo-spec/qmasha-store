'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, Check } from 'lucide-react'

interface AddToCartButtonProps {
  product: {
    id: string
    title: string
    price: number
    imageUrl: string
  }
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full py-4 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 text-lg shadow-xl active:scale-[0.99] ${
        added
          ? 'bg-emerald-600 text-white'
          : 'bg-black text-white hover:bg-gray-800'
      }`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5" /> تم الإضافة للسلة!
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5" /> إضافة إلى السلة
        </>
      )}
    </button>
  )
}