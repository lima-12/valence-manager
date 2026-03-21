'use client'

import { deleteProduct } from '@/actions/product-actions'
import { useState } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

interface DeleteButtonProps {
  id: string
  className?: string
  children?: React.ReactNode
  title?: string
}

export default function DeleteButton({ id, className, children }: DeleteButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    // 1. Modal de Confirmação Estilizado
    const result = await MySwal.fire({
      title: <span className="font-serif uppercase tracking-widest text-lg">Excluir Peça?</span>,
      text: "Esta ação não poderá ser desfeita no estoque da Valence.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1e293b', // slate-800
      cancelButtonColor: '#f1f5f9', // slate-100
      confirmButtonText: 'SIM, EXCLUIR',
      cancelButtonText: 'CANCELAR',
      customClass: {
        confirmButton: 'rounded-full px-6 py-2 text-xs font-bold tracking-widest',
        cancelButton: 'rounded-full px-6 py-2 text-xs font-bold tracking-widest text-slate-500'
      }
    })

    if (result.isConfirmed) {
      setLoading(true)
      
      // 2. Toast de "Em andamento"
      MySwal.fire({
        title: 'Processando...',
        allowOutsideClick: false,
        didOpen: () => {
          MySwal.showLoading()
        }
      })

      try {
        await deleteProduct(id) // Chama sua Action que limpa banco e storage
        
        // 3. Modal de Sucesso
        MySwal.fire({
          icon: 'success',
          title: 'Excluído!',
          text: 'O produto foi removido com sucesso.',
          timer: 2000,
          showConfirmButton: false
        })
      } catch (err) {
        MySwal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Não conseguimos excluir a peça agora.',
        })
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  )
}