'use client'

import Header from '@/components/Header'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()

  const handleWhatsAppCheckout = () => {
    const baseUrl = window.location.origin
    let message = `*Novo Pedido - Valence Semijoias*\n\n`
    
    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`
      message += `   Qtd: ${item.cartQuantity} x ${item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`
      message += `   Link: ${baseUrl}/produto/${item.id}\n\n`
    })

    message += `*Total: ${cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}*`
    
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/5591991824421?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="flex justify-center mb-6">
            <ShoppingBag size={64} className="text-slate-200" strokeWidth={1} />
          </div>
          <h1 className="font-serif text-2xl uppercase tracking-widest text-primary mb-4">Sua sacola está vazia</h1>
          <p className="text-slate-500 mb-8 font-light">Parece que você ainda não adicionou nenhum produto.</p>
          <Link 
            href="/" 
            className="inline-block px-8 py-4 bg-primary text-white text-[10px] uppercase tracking-[0.3em] rounded-full hover:bg-black transition-all"
          >
            Explorar Coleção
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* BOTÃO VOLTAR SUTIL */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-[10px] uppercase tracking-[0.2em] mb-8 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> 
          Voltar para a vitrine
        </Link>

        <h1 className="font-serif text-3xl uppercase tracking-[0.3em] text-primary mb-12 text-center">Sua Sacola</h1>

        <div className="space-y-8 mb-12">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 md:gap-6 items-center border-b border-slate-100 pb-8">
              <div className="w-20 h-24 md:w-24 md:h-32 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={item.product_images?.[0]?.url || '/placeholder.png'} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-[11px] uppercase tracking-widest font-bold text-slate-800 mb-1">{item.name}</h3>
                <p className="text-sm text-slate-500 font-light mb-4">
                  {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-slate-200 rounded-full px-3 py-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                      className="text-slate-400 hover:text-primary p-1"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-xs w-8 text-center font-medium">{item.cartQuantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                      className="text-slate-400 hover:text-primary p-1"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">
                  {(item.price * item.cartQuantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 p-8 rounded-2xl">
          <div className="flex justify-between items-center mb-8">
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Total do Pedido</span>
            <span className="text-2xl font-light text-slate-900">
              {cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={handleWhatsAppCheckout}
              className="w-full py-5 bg-[#25D366] text-white text-center text-[11px] font-bold uppercase tracking-[0.3em] rounded-full hover:shadow-xl transition-all shadow-md flex items-center justify-center gap-3"
            >
              Finalizar Pedido via WhatsApp
            </button>
            
            <Link 
              href="/" 
              className="w-full py-5 text-slate-400 text-center text-[9px] uppercase tracking-[0.3em] hover:text-primary transition-colors"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
