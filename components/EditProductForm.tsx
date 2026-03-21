'use client'

import { ChangeEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateProductAction } from '@/actions/product-actions'
import Swal from 'sweetalert2'

export default function EditProductForm({ product }: { product: any }) {
  const [loading, setLoading] = useState(false)
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState(product.product_images || [])
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])

  const router = useRouter()

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files)
      setNewFiles((prev) => [...prev, ...selected])
    }
  }

  const removeNewFile = (indexToRemove: number) => {
    setNewFiles((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleRemoveExisting = (url: string) => {
    setExistingImages((prev: any[]) => prev.filter((img: any) => img.url !== url))
    setImagesToDelete((prev) => [...prev, url])
  }

  const totalSize = newFiles.reduce((acc, file) => acc + file.size, 0)
  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2)
  const isOverLimit = totalSize > 20 * 1024 * 1024

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isOverLimit) {
      Swal.fire('Limite excedido', 'As novas imagens ultrapassam 20MB.', 'warning')
      return
    }

    const formData = new FormData(e.currentTarget)
    newFiles.forEach((file) => formData.append('new_images', file))
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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-2">Nome da Peça</label>
          <input
            name="name"
            type="text"
            required
            defaultValue={product.name}
            className="w-full border-b border-slate-200 py-3 text-slate-800 outline-none focus:border-valence-main transition bg-transparent"
            placeholder="Ex: Brinco Pérola Cravejada"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-2">Descrição Curta</label>
          <textarea
            name="description"
            rows={2}
            defaultValue={product.description || ''}
            className="w-full border-b border-slate-200 py-3 text-slate-800 outline-none focus:border-valence-main transition bg-transparent resize-none"
            placeholder="Detalhes sobre banho, pedras..."
          />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-2">Preço (R$)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              required
              defaultValue={product.price}
              className="w-full border-b border-slate-200 py-3 text-slate-800 outline-none focus:border-valence-main transition bg-transparent"
              placeholder="0,00"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-2">Qtd em Estoque</label>
            <input
              name="quantity"
              type="number"
              required
              defaultValue={product.quantity}
              className="w-full border-b border-slate-200 py-3 text-slate-800 outline-none focus:border-valence-main transition bg-transparent"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-4 text-center">Galeria Atual</label>
        <div className="grid grid-cols-4 gap-4">
          {existingImages.map((img: any, i: number) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-slate-100 group">
              <img src={img.url} alt="imagem atual" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveExisting(img.url)}
                className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-4 text-center">Adicionar Novas Fotos</label>

        <div className="relative border-2 border-dashed border-slate-100 rounded-xl p-10 text-center hover:bg-slate-50 transition-colors group">
          <input type="file" accept="image/*" multiple onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          <p className="text-slate-400 text-sm group-hover:text-valence-main transition-colors">Arraste ou clique para selecionar</p>
          <p className="text-[10px] text-slate-300 mt-2 uppercase">{totalSizeMB} MB / 20 MB</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          {newFiles.map((file, index) => (
            <div key={`${file.name}-${index}`} className="relative aspect-square rounded-lg overflow-hidden border border-slate-100 group">
              <img src={URL.createObjectURL(file)} alt="nova imagem" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeNewFile(index)}
                className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || isOverLimit}
        className="w-full py-5 bg-valence-main text-white font-bold rounded-full transition-all shadow-lg text-[11px] uppercase tracking-[0.3em] hover:bg-valence-deep disabled:bg-slate-100 disabled:text-slate-300 active:scale-95"
      >
        {loading ? 'Processando...' : 'Salvar Alterações'}
      </button>
    </form>
  )
}