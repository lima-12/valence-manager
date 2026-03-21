'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateProductAction } from '@/actions/product-actions'
import Swal from 'sweetalert2'
import Link from 'next/link'

export default function EditProductForm({ product }: { product: any }) {
  const [loading, setLoading] = useState(false)
  const [newFiles, setNewFiles] = useState<File[]>([])
  // Fotos que já estão no banco
  const [existingImages, setExistingImages] = useState(product.product_images || [])
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]) // Guarda IDs ou URLs para deletar dps

  const router = useRouter()

  const handleRemoveExisting = (url: string) => {
    setExistingImages(existingImages.filter((img: any) => img.url !== url))
    setImagesToDelete([...imagesToDelete, url])
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Adicionamos as novas fotos ao formData
    newFiles.forEach(file => formData.append('new_images', file))
    // Informamos quais fotos antigas devem ser removidas
    formData.append('delete_images', JSON.stringify(imagesToDelete))

    setLoading(true)
    try {
      await updateProductAction(product.id, formData)
      Swal.fire('Sucesso!', 'Peça atualizada com sucesso.', 'success')
      router.push('/admin')
      router.refresh()
    } catch (error) {
      Swal.fire('Erro', 'Falha ao atualizar produto.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-up">
      {/* BOTÃO VOLTAR SUTIL */}
      <Link 
        href="/admin" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-[10px] uppercase tracking-[0.2em] mb-8 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> 
        Voltar para listagem
      </Link>
  
      <form onSubmit={handleSubmit} className="space-y-10 bg-white p-10 border border-muted/20 shadow-sm">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl text-primary uppercase tracking-[0.25em]">Editar Peça</h1>
          <div className="w-12 h-px bg-primary mx-auto mt-4" />
        </div>
  
        <div className="grid grid-cols-1 gap-8">
          <div className="group">
            <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-widest">Nome da Joia</label>
            <input 
              name="name" 
              defaultValue={product.name} 
              className="w-full border-b border-muted/30 py-3 outline-none focus:border-primary transition-colors bg-transparent font-serif text-lg" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-widest">Preço (BRL)</label>
              <input 
                name="price" 
                type="number" 
                step="0.01" 
                defaultValue={product.price} 
                className="w-full border-b border-muted/30 py-3 outline-none focus:border-primary transition-colors" 
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-widest">Estoque Atual</label>
              <input 
                name="quantity" 
                type="number" 
                defaultValue={product.quantity} 
                className="w-full border-b border-muted/30 py-3 outline-none focus:border-primary transition-colors" 
              />
            </div>
          </div>
        </div>
  
        {/* GESTÃO DE IMAGENS ATUAIS */}
        <div>
          <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-4 tracking-widest">Galeria Atual</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {existingImages.map((img: any, i: number) => (
              <div key={i} className="relative aspect-[4/5] overflow-hidden border border-muted/10 group">
                <img src={img.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <button 
                  type="button" 
                  onClick={() => handleRemoveExisting(img.url)}
                  className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-red-500 hover:bg-red-500 hover:text-white rounded-full w-6 h-6 text-[10px] flex items-center justify-center transition-colors shadow-sm"
                >✕</button>
              </div>
            ))}
          </div>
        </div>
  
        {/* ADICIONAR NOVAS IMAGENS */}
        <div className="pt-8 border-t border-muted/10">
          <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-4 text-center tracking-widest">Adicionar Novas Fotografias</label>
          <div className="flex justify-center">
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={(e) => e.target.files && setNewFiles(Array.from(e.target.files))}
              className="text-[10px] uppercase tracking-widest file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:bg-primary file:text-white hover:file:bg-accent transition-all cursor-pointer"
            />
          </div>
        </div>
  
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-5 bg-primary text-white font-bold uppercase tracking-[0.3em] text-[11px] hover:bg-accent transition-all disabled:bg-muted/30 shadow-lg hover:shadow-xl active:scale-[0.98]"
        >
          {loading ? 'Processando Alterações...' : 'Confirmar Atualização'}
        </button>
      </form>
    </div>
  )
}