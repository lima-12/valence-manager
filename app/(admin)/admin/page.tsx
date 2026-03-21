import { ProductService } from '@/services/product-service'
import ProductCard from '@/components/ProductCard'
import Header from '@/components/Header'
import Link from 'next/link'
import DeleteButton from '@/components/DeleteButton'
import Footer from '@/components/Footer'
import { Edit3, Trash2, Plus } from 'lucide-react' // Ícones para manter o padrão

export const revalidate = 0 

export default async function AdminDashboard() {
  let products = []
  
  try {
    products = await ProductService.getAllProducts()
  } catch (error) {
    console.error('Erro ao carregar painel admin:', error)
    return <div className="p-10 text-red-500 font-sans uppercase tracking-widest text-xs">Erro de conexão com o banco.</div>
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 animate-fade-up">
        
        {/* --- CABEÇALHO DO PAINEL --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="text-left">
            <h1 className="font-serif text-3xl md:text-4xl text-primary uppercase tracking-[0.2em] mb-3">
              Gestão de Acervo
            </h1>
            <p className="text-muted-foreground text-[10px] uppercase tracking-[0.3em] font-medium">
              {products.length} peças registradas no sistema
            </p>
          </div>

          <Link 
            href="/admin/novo" 
            className="flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-full font-sans text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-accent hover:shadow-2xl active:scale-95 group"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
            Cadastrar Peça
          </Link>
        </div>

        {/* GRID DE GESTÃO */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-20">
          {products?.map((product) => ( 
            <div key={product.id} className="relative flex flex-col group">
              
              {/* O Card agora é apenas visual, o Link de clique foi para os botões abaixo no Admin */}
              <ProductCard product={product} />

              {/* BARRA DE AÇÕES: Sempre visível no Mobile, Hover sutil no Desktop */}
              <div className="mt-3 flex items-center justify-between gap-2 px-1">
                <Link 
                  href={`/admin/editar/${product.id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-primary/20 text-primary py-2 rounded-md text-[9px] uppercase tracking-widest font-bold hover:bg-primary hover:text-white transition-all active:scale-95"
                  title="Editar Peça"
                >
                  <Edit3 size={12} strokeWidth={2} />
                  <span className="hidden xs:inline">Editar</span>
                </Link>
                
                <DeleteButton 
                  id={product.id}
                  className="flex-shrink-0 p-2 bg-white border border-red-100 text-red-500 rounded-md hover:bg-red-50 transition-colors active:scale-90"
                  title="Excluir"
                >
                  <Trash2 size={12} strokeWidth={2} />
                </DeleteButton>
              </div>

              {/* Destaque visual discreto no Admin para o estoque */}
              <div className="absolute top-2 left-2 pointer-events-none">
                <span className={`text-[8px] uppercase tracking-tighter px-2 py-0.5 rounded-full ${product.quantity > 0 ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  Estoque: {product.quantity}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-32 border-2 border-dashed border-muted/20">
            <p className="font-serif text-muted-foreground italic tracking-widest">Inicie o seu catálogo adicionando a primeira joia.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}