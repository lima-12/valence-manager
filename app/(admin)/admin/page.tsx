// app/(admin)/admin/page.tsx
'use client'

import { createProduct } from '../../../actions/product-actions'
import { useState, useRef, ChangeEvent } from 'react'

export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]) // Estado para guardar os arquivos
  const formRef = useRef<HTMLFormElement>(null)

  // Função para adicionar arquivos (permite adicionar aos poucos)
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      // Adiciona os novos arquivos à lista existente
      setSelectedFiles((prev) => [...prev, ...newFiles])
    }
  }

  // Função para remover um arquivo específico da lista
  const removeFile = (indexToRemove: number) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  // Calcula o tamanho total em MB
  const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0)
  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2)
  const isOverLimit = totalSize > 20 * 1024 * 1024 // 20MB

  async function handleSubmit(formData: FormData) {
    // Validação extra no front
    if (selectedFiles.length === 0) {
      alert('Por favor, selecione pelo menos uma imagem.')
      return
    }

    if (isOverLimit) {
      alert('O tamanho total das imagens excede 20MB. Remova algumas fotos.')
      return
    }

    setLoading(true)
    
    try {
      // O FormData original traz os campos de texto, mas precisamos
      // injetar nossos arquivos gerenciados pelo React manualmente
      
      // Removemos qualquer arquivo que o input original tenha pego (para não duplicar)
      formData.delete('images') 
      
      // Adicionamos os arquivos da nossa lista "selectedFiles"
      selectedFiles.forEach((file) => {
        formData.append('images', file)
      })

      await createProduct(formData)
      
      alert('Produto salvo com sucesso!')
      formRef.current?.reset() // Limpa inputs de texto
      setSelectedFiles([]) // Limpa nossa lista de arquivos
      
    } catch (error) {
      alert('Erro ao salvar produto. Verifique se as imagens não são muito pesadas.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    // Max-w-xl garante que em telas grandes não fique "esticado demais", mas no celular ocupa 100%
    <div className="max-w-xl mx-auto mt-6 md:mt-10 p-6 bg-white rounded-xl shadow-lg border border-slate-100">
      <h1 className="text-2xl font-bold mb-6 text-valence-dark border-b pb-4 border-slate-100">
        Cadastrar Produto
      </h1>
      
      <form ref={formRef} action={handleSubmit} className="space-y-5">
        
        {/* Input estilizado com foco na cor da marca */}
        <div>
          <label className="block text-sm font-bold text-valence-deep mb-1">Nome do Produto</label>
          <input 
            name="name" 
            type="text" 
            required 
            className="w-full border-slate-300 border rounded-lg p-3 text-slate-800 outline-none focus:ring-2 focus:ring-valence-light focus:border-valence-main transition" 
            placeholder="Ex: Camisa Social Azul"
          />
        </div>
        
        {/* Campo de Descrição (Adicionei pois adicionamos no banco) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea name="description" rows={3} className="w-full border rounded-md p-2 mt-1 text-black outline-none" />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-bold text-valence-deep mb-1">Preço (R$)</label>
            <input 
                name="price" 
                type="number" 
                step="0.01" 
                required 
                className="w-full border-slate-300 border rounded-lg p-3 text-slate-800 outline-none focus:ring-2 focus:ring-valence-light focus:border-valence-main transition" 
                placeholder="0,00"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold text-valence-deep mb-1">Estoque</label>
            <input 
                name="quantity" 
                type="number" 
                required 
                className="w-full border-slate-300 border rounded-lg p-3 text-slate-800 outline-none focus:ring-2 focus:ring-valence-light focus:border-valence-main transition" 
                placeholder="0"
            />
          </div>
        </div>

        {/* ÁREA DE UPLOAD MELHORADA */}
        <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Fotos do Produto</label>
            
            {/* Input 'feio' escondido visualmente, mas funcional */}
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer">
                <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    // Nota: removemos o 'name="images"' daqui para não enviar duplicado automaticamente,
                    // nós vamos enviar manualmente no handleSubmit
                />
                <p className="text-gray-500">Clique ou arraste fotos aqui</p>
                <p className="text-xs text-gray-400 mt-1">Total acumulado: {totalSizeMB} MB / 20.00 MB</p>
            </div>

            {/* Aviso de limite */}
            {isOverLimit && (
                <p className="text-red-500 text-sm mt-2 font-bold">
                    ⚠️ Atenção: O tamanho total excede o limite permitido.
                </p>
            )}

            {/* Lista de Pré-visualização */}
            {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                    {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                            <div className="flex items-center gap-3 overflow-hidden">
                                {/* Miniatura da imagem usando URL.createObjectURL */}
                                <img 
                                    src={URL.createObjectURL(file)} 
                                    alt="preview" 
                                    className="w-10 h-10 object-cover rounded" 
                                />
                                <div className="truncate">
                                    <p className="text-sm text-gray-800 truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            
                            <button 
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <button 
          type="submit" 
          disabled={loading || isOverLimit}
          className={`w-full py-4 font-bold rounded-xl transition shadow-md text-lg
            ${loading || isOverLimit 
                ? 'bg-slate-200 cursor-not-allowed text-slate-400' 
                : 'bg-gradient-to-r from-valence-main to-valence-deep text-white hover:shadow-lg hover:scale-[1.01] active:scale-[0.98]'
            }`}
        >
          {loading ? 'Enviando...' : `Salvar Produto`}
        </button>
      </form>
    </div>
  )
}