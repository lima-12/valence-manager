import { ProductService } from '@/services/product-service'
import ProductCard from '@/components/ProductCard'
import Header from '@/components/Header'
import Link from 'next/link'
import DeleteButton from '@/components/DeleteButton'

// Garante que o Admin sempre veja os dados mais recentes do banco
export const revalidate = 0 

export default async function AdminDashboard() {
  let products = []
  
  try {
    // Busca os produtos usando o Service que você já tem
    products = await ProductService.getAllProducts()
  } catch (error) {
    console.error('Erro ao carregar painel admin:', error)
    return <div className="p-10 text-red-500">Erro ao carregar produtos no admin.</div>
  }

  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* Reutilizamos o Header para manter a identidade visual */}
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* --- CABEÇALHO DO PAINEL --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="text-center md:text-left">
            <h6 className="text-xl md:text-2xl font-serif text-valence-main uppercase tracking-widest text-sm mb-1">
              Painel de Gestão
            </h6>
            <p className="text-slate-500 text-xs uppercase tracking-tighter">
              {products.length} itens no catálogo
            </p>
          </div>

          <Link 
            href="/admin/novo" 
            className="bg-valence-main hover:bg-valence-deep text-white px-8 py-3 rounded-full font-serif text-sm uppercase tracking-widest transition shadow-md hover:shadow-lg active:scale-95"
          >
            + Novo Produto
          </Link>
        </div>

        {/* --- GRID (IDÊNTICO AO SHOP) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {products?.map((product) => ( 
            <div key={product.id} className="relative group">
              
              {/* Card visual original (agora restaurado) */}
              <ProductCard product={product} />

              {/* BARRA DE AÇÕES - Visível por padrão no Admin */}
              <div className="absolute top-3 right-3 flex gap-2 z-10">
                
                {/* BOTÃO EDITAR: Agora aponta para a página de edição */}
                <Link 
                  href={`/admin/editar/${product.id}`}
                  className="bg-white/95 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-blue-50 text-blue-600 border border-slate-100 transition-all active:scale-90 flex items-center justify-center"
                  title="Editar Produto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                </Link>
                
                {/* BOTÃO EXCLUIR: Seu DeleteButton que já criamos */}
                <DeleteButton 
                  id={product.id}
                  className="bg-white/95 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-red-50 text-red-600 border border-slate-100 transition-all active:scale-90 flex items-center justify-center"
                  title="Excluir Produto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </DeleteButton>
              </div>
            </div>
          ))}
        </div>
        
        {/* EMPTY STATE */}
        {products.length === 0 && (
          <div className="text-center py-24">
            <p className="font-serif text-slate-400 italic">Nenhum produto cadastrado no momento.</p>
          </div>
        )}
      </div>
    </main>
  )
}