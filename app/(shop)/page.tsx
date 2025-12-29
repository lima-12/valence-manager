// app/(shop)/page.tsx
import { ProductService } from '@/services/product-service'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

export const revalidate = 0

export default async function Home() {
  let products = []
  try {
    products = await ProductService.getAllProducts()
  } catch (error) {
    return <div className="p-10 text-red-500">Erro ao carregar produtos.</div>
  }

  return (
    // Mudamos o fundo para um cinza muito suave, quase branco, para destacar o azul
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      
      {/* Header Responsivo */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="text-center md:text-left">
          {/* Título com a cor Valency Dark */}
          <h1 className="text-4xl font-extrabold text-valency-dark tracking-tight">
            VALENCY
          </h1>
          <p className="text-valency-sky font-medium">Controle de Estoque e Vitrine</p>
        </div>
        
        <Link 
          href="/admin" 
          // Botão com o Azul Principal e Hover no Azul Profundo
          className="bg-valency-main text-white px-6 py-2 rounded-full hover:bg-valency-deep transition shadow-lg hover:shadow-xl font-semibold"
        >
          + Novo Produto
        </Link>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products?.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  )
}