'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateProductAction } from '@/actions/product-actions'
import Swal from 'sweetalert2'

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
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl text-valence-main uppercase tracking-widest">Editar Peça</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400">Nome</label>
          <input name="name" defaultValue={product.name} className="w-full border-b py-2 outline-none focus:border-valence-main" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400">Preço</label>
            <input name="price" type="number" step="0.01" defaultValue={product.price} className="w-full border-b py-2 outline-none" />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400">Estoque</label>
            <input name="quantity" type="number" defaultValue={product.quantity} className="w-full border-b py-2 outline-none" />
          </div>
        </div>
      </div>

      {/* GESTÃO DE IMAGENS ATUAIS */}
      <div>
        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-4">Imagens Atuais</label>
        <div className="grid grid-cols-4 gap-4">
          {existingImages.map((img: any, i: number) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border">
              <img src={img.url} className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => handleRemoveExisting(img.url)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
              >✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* ADICIONAR NOVAS IMAGENS */}
      <div className="pt-4 border-t">
        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2 text-center">Adicionar Novas Fotos</label>
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          onChange={(e) => e.target.files && setNewFiles(Array.from(e.target.files))}
          className="text-xs text-slate-400"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-4 bg-valence-main text-white font-bold rounded-full uppercase tracking-widest text-[11px] hover:bg-valence-deep transition disabled:bg-slate-200"
      >
        {loading ? 'Salvando...' : 'Salvar Alterações'}
      </button>
    </form>
  )
}