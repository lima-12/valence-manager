// app/admin/page.tsx
'use client' // Marque como Client Component para usar eventos de clique

import { createProduct } from '../actions/product-actions'
import { useState } from 'react'

export default function AdminPage() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      await createProduct(formData)
      alert('Produto salvo com sucesso!')
      // Opcional: limpar o formulário aqui
    } catch (error) {
      alert('Erro ao salvar produto. Verifique o console.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Cadastrar Produto - Valency</h1>
      
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome do Produto</label>
          <input name="name" type="text" required className="w-full border rounded-md p-2 mt-1 text-black outline-none focus:ring-2 focus:ring-black" />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Preço</label>
            <input name="price" type="number" step="0.01" required className="w-full border rounded-md p-2 mt-1 text-black outline-none" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Qtd em Estoque</label>
            <input name="quantity" type="number" required className="w-full border rounded-md p-2 mt-1 text-black outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Foto do Produto</label>
          <input name="image" type="file" accept="image/*" required className="w-full mt-1 text-gray-600" />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-2 rounded-md transition ${loading ? 'bg-gray-400' : 'bg-black text-white hover:bg-gray-800'}`}
        >
          {loading ? 'Salvando...' : 'Salvar no Estoque'}
        </button>
      </form>
    </div>
  )
}