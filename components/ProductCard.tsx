// components/ProductCard.tsx
'use client'

import { useState } from 'react'
import { Product } from '@/types/product'

interface ProductProps {
  product: Product;
}

export default function ProductCard({ product }: ProductProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const images = product.product_images || []

  const formatPrice = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return (
    <div className="group flex flex-col gap-3">
      
      <div className="relative w-full aspect-[4/5] bg-slate-100 rounded-lg overflow-hidden">
        {images.length > 0 ? (
          <img 
            src={images[currentImageIndex].url} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
            <span className="text-xs">Sem foto</span>
          </div>
        )}

        {/* Badge Esgotado sutil */}
        {product.quantity === 0 && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-slate-800 text-xs font-bold px-3 py-1 border border-slate-800 uppercase tracking-widest">
              Esgotado
            </span>
          </div>
        )}
      </div>

      {/* --- DETALHES --- */}
      <div className="px-1 flex flex-col items-center text-center"> {/* Centralizei o texto para ficar mais chique */}
        <h3 className="text-slate-700 font-medium text-base line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-lg font-bold text-valence-main mt-1">
          {formatPrice(product.price)}
        </p>
        
        {/* <p className="text-[11px] text-slate-400 uppercase tracking-wide">
          Em até 3x de {formatPrice(product.price / 3)}
        </p> */}
      </div>
    </div>
  )
}