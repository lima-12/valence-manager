'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData: FormData) {
  try {
    const supabase = await createClient()
    
    const name = formData.get('name') as string
    const price = formData.get('price') as string
    const quantity = formData.get('quantity') as string
    const description = formData.get('description') as string
    const imageFiles = formData.getAll('images') as File[]

    if (!name || !price || imageFiles.length === 0 || imageFiles[0].size === 0) {
      throw new Error('Preencha todos os campos e adicione imagens.')
    }

    const uploadedImages = []

    for (const [index, file] of imageFiles.entries()) {
      if (file.size > 0) {
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

    const parsedPrice = Number.parseFloat(price)
    const parsedQuantity = Number.parseInt(quantity, 10)

    if (!Number.isFinite(parsedPrice)) throw new Error('Preço inválido.')
    if (!Number.isFinite(parsedQuantity)) throw new Error('Quantidade inválida.')

    const { data: newProduct, error: productError } = await supabase
      .from('products')
      .insert({
        name,
        price: parsedPrice,
        quantity: parsedQuantity,
        description: description || '',
      })
      .select('id')
      .single()

    if (productError) throw new Error(`Erro ao criar produto: ${productError.message}`)

    if (uploadedImages.length > 0) {
      const { error: imagesError } = await supabase
        .from('product_images')
        .insert(
          uploadedImages.map((img) => ({
            product_id: newProduct.id,
            url: img.url,
            display_order: img.display_order,
          }))
        )

      if (imagesError) throw new Error(`Erro ao salvar imagens: ${imagesError.message}`)
    }

    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }

  } catch (error: any) {
    console.error('Erro na criação:', error)
    throw new Error(error.message || 'Falha ao processar requisição.')
  }
}

export async function deleteProduct(productId: string) {
  try {
    const supabase = await createClient()

    const { data: images, error: fetchError } = await supabase
      .from('product_images')
      .select('url')
      .eq('product_id', productId)

    if (fetchError) throw fetchError

    if (images && images.length > 0) {
      const filePaths = images.map(img => {
        const urlParts = img.url.split('/')
        return urlParts[urlParts.length - 1]
      })

      const { error: storageError } = await supabase.storage
        .from('products')
        .remove(filePaths)

      if (storageError) console.error('Aviso: Erro ao apagar fotos do storage:', storageError)
    }

    const { error: imagesError } = await supabase
      .from('product_images')
      .delete()
      .eq('product_id', productId)
    
    if (imagesError) throw imagesError

    const { error: productError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (productError) throw productError

    revalidatePath('/')
    revalidatePath('/admin')
    
    return { success: true }

  } catch (error: any) {
    console.error('Erro na exclusão:', error.message)
    throw new Error('Não foi possível excluir o produto.')
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  try {
    const supabase = await createClient()

    // 1. Atualizar dados básicos
    const name = formData.get('name') as string
    const rawPrice = formData.get('price')
    const rawQuantity = formData.get('quantity')
    const price = Number.parseFloat(String(rawPrice ?? ''))
    const quantity = Number.parseInt(String(rawQuantity ?? ''), 10)
    const description = (formData.get('description') as string) || ''
    const deleteImages = JSON.parse((formData.get('delete_images') as string) || '[]')
    const newFiles = formData.getAll('new_images') as File[]

    if (!id) throw new Error('ID do produto ausente.')
    if (!name) throw new Error('Nome é obrigatório.')
    if (!Number.isFinite(price)) throw new Error('Preço inválido.')
    if (!Number.isFinite(quantity)) throw new Error('Quantidade inválida.')

    // Update na tabela products
    const { data: updatedRows, error: updateError } = await supabase
      .from('products')
      .update({ name, price, quantity, description })
      .eq('id', id)
      // Importante: garante que houve linha afetada e força o PostgREST a tentar retornar algo.
      .select('id')

    if (updateError) throw new Error(`Erro ao atualizar dados: ${updateError.message}`)
    if (!updatedRows || updatedRows.length === 0) {
      // Geralmente indica: id não encontrado OU policy RLS bloqueando UPDATE (sem erro).
      throw new Error('Nenhuma linha foi atualizada (verifique ID e policies de UPDATE no Supabase/RLS).')
    }

    // 2. Deletar imagens selecionadas
    if (deleteImages.length > 0) {
      const fileNames = deleteImages.map((url: string) => url.split('/').pop())
      
      const { error: storageError } = await supabase.storage
        .from('products')
        .remove(fileNames)
      
      if (storageError) console.error('Erro ao remover do storage:', storageError.message)
      
      const { error: deleteImgError } = await supabase
        .from('product_images')
        .delete()
        .in('url', deleteImages)
        
      if (deleteImgError) throw new Error(`Erro ao remover imagens do banco: ${deleteImgError.message}`)
    }

    // 3. Upload de novas imagens
    for (const file of newFiles) {
      if (file.size > 0) {
        const fileName = `prod-${id}-${Date.now()}`
        
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, file)

        if (uploadError) throw new Error(`Erro no upload da imagem: ${uploadError.message}`)

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName)
        
        const { error: insertImgError } = await supabase
          .from('product_images')
          .insert({
            product_id: id,
            url: publicUrl,
            display_order: 99
          })
          
        if (insertImgError) throw new Error(`Erro ao salvar nova imagem: ${insertImgError.message}`)
      }
    }

    revalidatePath('/admin')
    revalidatePath(`/produto/${id}`)
    
    return { success: true }
  } catch (error: any) {
    console.error('Falha na atualização:', error.message)
    throw new Error(error.message || 'Falha ao atualizar produto.')
  }
}
