import { ProductService } from '@/services/product-service'
import ProductCard from '@/components/ProductCard'
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
      
      <header className="bg-white shadow-sm sticky top-0 z-10 transition-all">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          <div className="relative w-full md:w-auto flex justify-center md:justify-start">
              <Image 
                src="/logo-valence.png" 
                alt="Valence Semijoias"
                width={180}
                height={60} 
                priority
                className="object-contain"
              />
          </div>

          <div className="w-full md:w-auto flex flex-col md:flex-row gap-3 items-center">
            
            {/* Input de Busca */}
            <div className="w-full md:w-80 relative group">
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="w-full bg-slate-100 text-slate-700 rounded-full py-2 px-4 pl-10 text-sm outline-none focus:ring-1 focus:ring-valence-light transition-all"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-valence-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <Link 
              href="/admin" 
              className="hidden md:block bg-valence-main text-white px-5 py-2 rounded-full hover:bg-valence-deep transition text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md whitespace-nowrap"
            >
              Área Admin
            </Link>
          </div>

        </div>
      </header>

      {/* --- CONTEÚDO (GRID) --- */}

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