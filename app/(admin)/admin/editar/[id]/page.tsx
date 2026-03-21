import { ProductService } from '@/services/product-service'
import Header from '@/components/Header'
import { notFound } from 'next/navigation'
import EditProductForm from '@/components/EditProductForm'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditPage({ params }: PageProps) {
  const { id } = await params
  const product = await ProductService.getProductById(id)

  if (!product) notFound()

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Header />
      <div className="max-w-2xl mx-auto mt-12 px-6">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-slate-400 hover:text-valence-main transition text-xs uppercase tracking-widest mb-6"
        >
          ← Voltar para listagem
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10">
          <div className="mb-10 text-center">
            <h1 className="font-serif text-3xl text-valence-main uppercase tracking-widest mb-2">
              Editar Produto
            </h1>
            <p className="text-slate-400 text-sm italic">Atualize os detalhes da peça</p>
          </div>

          <EditProductForm product={product} />
        </div>
      </div>
    </main>
  )
}