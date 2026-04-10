'use client'

import { Product } from '@/types/product'
import { useCart } from '@/context/CartContext'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useRouter } from 'next/navigation'

const MySwal = withReactContent(Swal)

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const router = useRouter()

  const handleAddToCart = () => {
    addToCart(product)
    
    MySwal.fire({
      title: <p className="font-serif uppercase tracking-widest text-sm">Adicionado ao Carrinho</p>,
      text: `${product.name} foi adicionado à sua sacola.`,
      icon: 'success',
      confirmButtonText: 'Ver Carrinho',
      showCancelButton: true,
      cancelButtonText: 'Continuar Comprando',
      confirmButtonColor: '#3E5365', // Cor primary da Valence
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/carrinho')
      }
    })
  }

  return (
    <button 
      onClick={handleAddToCart}
      disabled={product.quantity === 0}
      className={`w-full py-5 text-white text-center text-[11px] font-bold uppercase tracking-[0.3em] rounded-full transition-all shadow-md ${
        product.quantity === 0 
          ? 'bg-slate-300 cursor-not-allowed' 
          : 'bg-primary hover:bg-accent hover:shadow-xl'
      }`}
    >
      {product.quantity === 0 ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
    </button>
  )
}
