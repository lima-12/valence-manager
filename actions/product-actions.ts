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

export async function deleteProduct(productId: string) {
  try {
    // 1. BUSCAR IMAGENS: Precisamos dos nomes dos arquivos para limpar o Storage
    const { data: images, error: fetchError } = await supabase
      .from('product_images')
      .select('url')
      .eq('product_id', productId)

    if (fetchError) throw fetchError

    // 2. LIMPAR STORAGE: Apaga os arquivos físicos no Bucket
    if (images && images.length > 0) {
      const filePaths = images.map(img => {
        const urlParts = img.url.split('/')
        return urlParts[urlParts.length - 1] // Pega o final da URL (nome do arquivo)
      })

      const { error: storageError } = await supabase.storage
        .from('products')
        .remove(filePaths)

      if (storageError) console.error('Aviso: Erro ao apagar fotos do storage:', storageError)
    }

    // 3. APAGAR REGISTROS (BANCO): Primeiro imagens, depois o produto
    // (Se você tiver 'Cascade Delete' no Postgres, apagar o produto já apagaria as imagens)
    await supabase.from('product_images').delete().eq('product_id', productId)
    
    const { error: productError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (productError) throw productError

    // 4. ATUALIZAR TELA: Avisa ao Next.js que os dados mudaram
    revalidatePath('/')
    revalidatePath('/admin')
    
    return { success: true }

  } catch (error: any) {
    console.error('Erro na exclusão:', error.message)
    throw new Error('Não foi possível excluir o produto.')
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  // 1. Atualizar dados básicos
  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string)
  const quantity = parseInt(formData.get('quantity') as string)
  const description = (formData.get('description') as string) || ''
  const deleteImages = JSON.parse(formData.get('delete_images') as string || '[]')
  const newFiles = formData.getAll('new_images') as File[]

  // Update na tabela products
  await supabase.from('products').update({ name, price, quantity, description }).eq('id', id)

  // 2. Deletar imagens selecionadas
  if (deleteImages.length > 0) {
    // Remove do Storage (precisaria extrair o nome do arquivo da URL)
    const fileNames = deleteImages.map((url: string) => url.split('/').pop())
    await supabase.storage.from('products').remove(fileNames)
    
    // Remove do Banco
    await supabase.from('product_images').delete().in('url', deleteImages)
  }

  // 3. Upload de novas imagens
  for (const file of newFiles) {
    if (file.size > 0) {
      const fileName = `prod-${id}-${Date.now()}`
      await supabase.storage.from('products').upload(fileName, file)
      const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName)
      
      await supabase.from('product_images').insert({
        product_id: id,
        url: publicUrl,
        display_order: 99 // ou lógica de ordem
      })
    }
  }

  revalidatePath('/admin')
  revalidatePath(`/produto/${id}`)
}