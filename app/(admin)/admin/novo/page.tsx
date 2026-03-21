'use client'

import { createProduct } from '../../../../actions/product-actions'
import { useState, useRef, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0)
  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2)
  const isOverLimit = totalSize > 20 * 1024 * 1024

  async function handleSubmit(formData: FormData) {
    if (selectedFiles.length === 0) return alert('Adicione pelo menos uma imagem.')
    if (isOverLimit) return alert('Limite de 20MB excedido.')

    setLoading(true)
    try {
      formData.delete('images') 
      selectedFiles.forEach((file) => formData.append('images', file))

      await createProduct(formData)
      alert('Produto cadastrado com sucesso!')
      router.push('/admin') // Volta para a listagem após salvar
      router.refresh()
    } catch (error) {
      alert('Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Header />

      <div className="max-w-2xl mx-auto mt-12 px-6">
        {/* BOTÃO VOLTAR */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-valence-main transition text-xs uppercase tracking-widest mb-6"
        >
          ← Voltar para listagem
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10">
          <div className="mb-10 text-center">
            <h1 className="font-serif text-3xl text-valence-main uppercase tracking-widest mb-2">
              Novo Produto
            </h1>
            <p className="text-slate-400 text-sm italic">Preencha os detalhes da nova peça</p>
          </div>
          
          <form ref={formRef} action={handleSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-2">Nome da Peça</label>
                <input 
                  name="name" 
                  type="text" 
                  required 
                  className="w-full border-b border-slate-200 py-3 text-slate-800 outline-none focus:border-valence-main transition bg-transparent" 
                  placeholder="Ex: Brinco Pérola Cravejada"
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-2">Descrição Curta</label>
                <textarea 
                  name="description" 
                  rows={2} 
                  className="w-full border-b border-slate-200 py-3 text-slate-800 outline-none focus:border-valence-main transition bg-transparent resize-none" 
                  placeholder="Detalhes sobre banho, pedras..."
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-2">Preço (R$)</label>
                  <input name="price" type="number" step="0.01" required className="w-full border-b border-slate-200 py-3 text-slate-800 outline-none focus:border-valence-main transition bg-transparent" placeholder="0,00" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-2">Qtd em Estoque</label>
                  <input name="quantity" type="number" required className="w-full border-b border-slate-200 py-3 text-slate-800 outline-none focus:border-valence-main transition bg-transparent" placeholder="0" />
                </div>
              </div>
            </div>

            {/* UPLOAD */}
            <div className="pt-4">
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-4 text-center">Galeria de Fotos</label>
                
                <div className="relative border-2 border-dashed border-slate-100 rounded-xl p-10 text-center hover:bg-slate-50 transition-colors group">
                    <input type="file" accept="image/*" multiple onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <p className="text-slate-400 text-sm group-hover:text-valence-main transition-colors">Arraste ou clique para selecionar</p>
                    <p className="text-[10px] text-slate-300 mt-2 uppercase">{totalSizeMB} MB / 20 MB</p>
                </div>

                {/* PRÉ-VISUALIZAÇÃO MINIMALISTA */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                    {selectedFiles.map((file, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-100 group">
                            <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                            <button 
                                type="button"
                                onClick={() => removeFile(index)}
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
              {loading ? 'Processando...' : 'Finalizar Cadastro'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}