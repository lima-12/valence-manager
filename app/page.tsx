import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Forçamos a página a não usar cache para que novos produtos apareçam na hora
export const revalidate = 0;

export default async function Home() {
  // 1. Buscar os produtos no Supabase
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-10 text-red-500">Erro ao carregar estoque: {error.message}</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      {/* Header simples */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-black tracking-tight">VALENCY</h1>
          <p className="text-gray-500">Controle de Estoque e Vitrine</p>
        </div>
        <Link 
          href="/admin" 
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition shadow-md"
        >
          + Novo Produto
        </Link>
      </div>

      {/* Grid de Produtos */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group"
            >
              {/* Container da Imagem */}
              <div className="relative h-64 w-full overflow-hidden bg-gray-200">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Detalhes */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
                  <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    Qtd: {product.quantity}
                  </span>
                </div>
                
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {product.description || 'Sem descrição disponível.'}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-black">
                    R$ {Number(product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <button className="text-sm font-medium text-gray-400 hover:text-black transition">
                    Ver detalhes
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-400 text-lg">Nenhum produto cadastrado ainda.</p>
          </div>
        )}
      </div>
    </main>
  );
}