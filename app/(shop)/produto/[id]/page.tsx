import { ProductService } from '@/services/product-service'
import Header from '@/components/Header'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetails({ params }: PageProps) {
  const { id } = await params
  const product = await ProductService.getProductById(id)

  if (!product) notFound()

  const images = product.product_images || []
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const whatsappMessage = encodeURIComponent(
    `Olá! Gostaria de realizar o pedido do produto: ${product.name}\nLink: ${baseUrl}/produto/${id}`
  )
  const whatsappUrl = `https://wa.me/5591999999999?text=${whatsappMessage}`

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
        
        {/* BOTÃO VOLTAR SUTIL */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-valence-main transition-colors text-[10px] uppercase tracking-[0.2em] mb-8 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> 
          Voltar para a vitrine
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* GALERIA */}
          <div className="flex flex-col gap-6">
            <div className="aspect-[4/5] bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              <img 
                src={images[0]?.url || '/placeholder.png'} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.slice(1).map((img, index) => (
                  <div key={index} className="aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-50">
                    <img src={img.url} alt="Galeria" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* INFOS */}
          <div className="flex flex-col justify-center">
            <h1 className="font-serif text-3xl md:text-4xl text-valence-main uppercase tracking-[0.2em] mb-4">
              {product.name}
            </h1>
            
            <p className="text-2xl text-slate-800 font-light mb-8">
              {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>

            <div className="mb-10">
              <h2 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Descrição</h2>
              <p className="text-slate-600 leading-relaxed font-light">
                {product.description || "Peça exclusiva Valence Semijoias."}
              </p>
            </div>

            <a 
              href={whatsappUrl}
              target="_blank"
              className="w-full py-5 bg-[#25D366] text-white text-center text-[11px] font-bold uppercase tracking-[0.3em] rounded-full hover:shadow-xl transition-all shadow-md"
            >
              Realizar Pedido via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}