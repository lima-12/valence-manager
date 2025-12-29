// components/ProductCard.tsx
'use client' // Importante: Permite interatividade (state, click)

import { useState } from 'react'

interface ProductImages {
  url: string;
  display_order: number;
}

interface ProductProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    quantity: number;
    // O Supabase retorna as tabelas relacionadas como um array dentro do objeto
    product_images: ProductImages[];
  }
}

export default function ProductCard({ product }: ProductProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Ordena as imagens (caso tenha display_order) ou pega como vier
  const images = product.product_images || []
  const hasMultipleImages = images.length > 1

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault() // Evita abrir o link de detalhes se houver
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100 group relative flex flex-col">
      
      {/* Área da Imagem / Carrossel */}
      <div className="relative h-64 w-full bg-gray-100">
        {images.length > 0 ? (
          <img 
            src={images[currentImageIndex].url} 
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sem foto
          </div>
        )}

        {/* Setas de Navegação (Só mostra se tiver + de 1 foto) */}
        {hasMultipleImages && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ←
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              →
            </button>
            
            {/* Indicador de pontos (bolinhas) */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 w-1.5 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Detalhes do Produto */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          {/* Título no Azul Escuro */}
          <h2 className="text-xl font-bold text-valency-dark">{product.name}</h2>
          
          {/* Badge de Quantidade mais sutil */}
          <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-slate-200">
            Qtd: {product.quantity}
          </span>
        </div>
        
        <p className="text-slate-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
          {product.description || 'Sem descrição.'}
        </p>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-50">
          {/* Preço com destaque no Azul Principal */}
          <span className="text-2xl font-black text-valency-main">
            R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          
          <button className="text-sm font-medium text-valency-sky hover:text-valency-deep transition">
            Ver detalhes
          </button>
        </div>
      </div>
    </div>
  )
}