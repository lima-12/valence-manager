'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const price = formData.get('price') as string
    const quantity = formData.get('quantity') as string
    const imageFile = formData.get('image') as File

    // Log para debug (aparecerá no seu terminal)
    console.log('Tentando upload de:', name)

    if (!imageFile || imageFile.size === 0) {
      throw new Error('Imagem não selecionada ou vazia')
    }

    const fileName = `${Date.now()}-${imageFile.name}`
    
    // 1. Upload
    const { data: imageData, error: imageError } = await supabase.storage
      .from('products')
      .upload(fileName, imageFile)

    if (imageError) {
      console.error('Erro no Storage:', imageError)
      throw imageError
    }

    // 2. URL
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(fileName)

    // 3. Banco
    const { error: dbError } = await supabase.from('products').insert({
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      image_url: publicUrl,
    })

    if (dbError) {
      console.error('Erro no Banco:', dbError)
      throw dbError
    }

    revalidatePath('/')
    return { success: true }

  } catch (error) {
    console.error('Erro completo:', error)
    throw new Error('Falha ao salvar produto')
  }
}