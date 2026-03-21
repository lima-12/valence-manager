import { ProductService } from '@/services/product-service'
import ProductCard from '@/components/ProductCard'
import Header from '@/components/Header'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 0

export default async function Home() {
  let products = []
  try {
    products = await ProductService.getAllProducts()
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    return <div className="p-10 text-red-500">Erro ao carregar produtos.</div>
  }

  return (
    <main className="min-h-screen bg-slate-50">
      
      <Header />

      {/* --- GRID --- */}
      <div className="max-w-6xl mx-auto px-6 py-8"> {/* Aumentei px-4 para px-6 no mobile para dar respiro nas laterais */}
        
        <h6 className="text-xl md:text-2xl font-serif text-valence-main mb-8 text-center uppercase tracking-widest text-sm">
          Coleção Exclusiva
        </h6>

        {/* grid-cols-1 (Mobile: 1 produto grande)
            sm:grid-cols-2 (Tablet pequeno: 2 produtos)
            md:grid-cols-3 (PC: 3 produtos)
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {products?.map((product) => ( 
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {/* ... empty state ... */}
      </div>
    </main>
  )
}