import { ProductService } from '@/services/product-service'
import ProductCard from '@/components/ProductCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const revalidate = 0

export default async function Home() {
  let products = []
  try {
    products = await ProductService.getAllProducts()
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    return <div className="p-10 text-red-500 font-sans uppercase tracking-widest text-xs">Erro ao carregar catálogo.</div>
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 animate-fade-up">
        {/* Título com espaçamento de luxo */}
        <div className="text-center mb-16 md:mb-24">
          <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-4">
            Curadoria Especial
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-primary uppercase tracking-[0.2em]">
            Coleção Exclusiva
          </h2>
          <div className="w-12 h-px bg-primary/30 mx-auto mt-8" />
        </div>

        {/* GRID: 2 colunas mobile / 4 colunas desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-20">
          {products?.map((product) => ( 
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-32">
            <p className="font-serif text-muted-foreground italic tracking-widest">Nenhuma peça disponível no momento.</p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}