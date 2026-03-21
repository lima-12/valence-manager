import { ProductService } from '@/services/product-service'
import Header from '@/components/Header'
import { notFound } from 'next/navigation'
import EditProductForm from '@/components/EditProductForm'

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
      <div className="max-w-3xl mx-auto mt-12 px-6">
        <EditProductForm product={product} />
      </div>
    </main>
  )
}