'use server'

import { supabase } from '@/lib/supabase'
import { ProductService } from '@/services/product-service' // <--- Importa o Service
import { revalidatePath } from 'next/cache'

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const price = formData.get('price') as string
    const quantity = formData.get('quantity') as string
    const description = formData.get('description') as string
    const imageFiles = formData.getAll('images') as File[]

    if (!name || !price || imageFiles.length === 0 || imageFiles[0].size === 0) {
      throw new Error('Preencha todos os campos e adicione imagens.')
    }

    // --- LÓGICA DE UPLOAD (Continua na Action pois lida com Arquivos/IO) ---
    const uploadedImages = []

    for (const [index, file] of imageFiles.entries()) {
      if (file.size > 0) {
        // Geramos um ID temporário ou usamos timestamp para o nome
        const fileName = `temp-${Date.now()}-${index}`
        
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName)
        
        uploadedImages.push({ url: publicUrl, display_order: index })
      }
    }

    // --- CHAMA O SERVICE (Camada de Dados) ---
    await ProductService.createProductWithImages({
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      description: description || '',
      images: uploadedImages
    })

    revalidatePath('/')
    return { success: true }

  } catch (error: any) {
    console.error('Erro:', error)
    throw new Error(error.message || 'Falha ao processar requisição.')
  }
}