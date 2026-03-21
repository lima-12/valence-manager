'use client'

import { useState } from 'react'
import { Product } from '@/types/product'
import Link from 'next/link'

interface ProductProps {
  product: Product;
}

export default function ProductCard({ product }: ProductProps) {
  const images = product.product_images || []

  const formatPrice = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return (
    <Link href={`/produto/${product.id}`} className="group flex flex-col gap-3 cursor-pointer">
      <div className="relative w-full aspect-[4/5] bg-slate-100 rounded-lg overflow-hidden">
        {images.length > 0 ? (
          <img 
            src={images[0].url} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
            <span className="text-xs italic font-serif">Sem foto</span>
          </div>
        )}

        {product.quantity === 0 && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-slate-800 text-[10px] font-bold px-3 py-1 border border-slate-800 uppercase tracking-widest">
              Esgotado
            </span>
          </div>
        )}
      </div>

      <div className="px-1 flex flex-col items-center text-center">
        <h3 className="text-slate-700 font-serif text-base line-clamp-1 group-hover:text-valence-main transition-colors uppercase tracking-wider">
          {product.name}
        </h3>
        <p className="text-lg font-light text-valence-main mt-1">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  )
}