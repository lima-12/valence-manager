'use client'

import { Product } from '@/types/product'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

interface ProductProps {
  product: Product;
}

export default function ProductCard({ product }: ProductProps) {
  const { addToCart } = useCart()
  const images = product.product_images || []
  const hasSecondImage = images.length > 1

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    
    MySwal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Adicionado à sacola',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    })
  }

  const formatPrice = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2 
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/produto/${product.id}`} className="group flex flex-col gap-3 cursor-pointer">
        {/* CONTAINER DA IMAGEM */}
        <div className="relative w-full aspect-[4/5] bg-background overflow-hidden border border-muted/20">
          
          {images.length > 0 ? (
            <>
              {/* Imagem Principal */}
              <img 
                src={images[0].url} 
                alt={product.name}
                className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                  hasSecondImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'
                }`}
              />
              
              {/* Segunda Imagem (Hover) */}
              {hasSecondImage && (
                <img 
                  src={images[1].url} 
                  alt={`${product.name} - detalhe`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out scale-100 group-hover:scale-105"
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted bg-background">
              <span className="text-[10px] uppercase tracking-widest font-serif">Sem imagem</span>
            </div>
          )}

          {/* TAG ESGOTADO */}
          {product.quantity === 0 && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
              <span className="text-primary text-[9px] font-bold px-3 py-1.5 border border-primary bg-white/90 uppercase tracking-[0.2em]">
                Esgotado
              </span>
            </div>
          )}

          {/* BOTÃO RÁPIDO NO HOVER (APENAS DESKTOP) */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 hidden md:block">
             <button 
                onClick={handleQuickAdd}
                disabled={product.quantity === 0}
                className="w-full bg-primary/90 backdrop-blur-sm text-white text-[9px] py-2 text-center uppercase tracking-[0.2em] font-medium hover:bg-accent transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
             >
                {product.quantity === 0 ? 'Esgotado' : 'Adicionar à Sacola'}
             </button>
          </div>
        </div>

        {/* INFORMAÇÕES DO PRODUTO */}
        <div className="px-1 flex flex-col items-center text-center">
          <h3 className="text-accent font-serif text-sm md:text-base line-clamp-1 group-hover:text-primary transition-colors uppercase tracking-[0.15em]">
            {product.name}
          </h3>
          <p className="text-sm md:text-base font-light text-primary mt-0.5 tracking-tight">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}