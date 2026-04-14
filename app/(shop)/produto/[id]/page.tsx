import { ProductService } from '@/services/product-service'
import Header from '@/components/Header'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AddToCartButton from '@/components/AddToCartButton'
import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/site-url'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const product = await ProductService.getProductById(id)
  if (!product) {
    return { title: 'Produto' }
  }
  const images = product.product_images || []
  const firstImage = images[0]?.url
  const site = getSiteUrl()
  return {
    title: product.name,
    description:
      product.description?.slice(0, 160) ||
      `${product.name} — Valence Semijoias.`,
    openGraph: {
      title: product.name,
      description:
        product.description?.slice(0, 160) ||
        `${product.name} — Valence Semijoias.`,
      url: `${site}/produto/${id}`,
      images: firstImage ? [{ url: firstImage, alt: product.name }] : undefined,
    },
  }
}

export default async function ProductDetails({ params }: PageProps) {
  const { id } = await params
  const product = await ProductService.getProductById(id)

  if (!product) notFound()

  const images = product.product_images || []

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
        
        {/* BOTÃO VOLTAR SUTIL */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-[10px] uppercase tracking-[0.2em] mb-8 group"
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
                {images.slice(1).map((img: { url: string }, index: number) => (
                  <div key={index} className="aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-50">
                    <img src={img.url} alt="Galeria" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* INFOS */}
          <div className="flex flex-col justify-center">
            <h1 className="font-serif text-3xl md:text-4xl text-primary uppercase tracking-[0.4em] mb-4">
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

            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </main>
  )
}