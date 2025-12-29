import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'

export interface CreateProductDTO {
    name: string;
    price: number;
    quantity: number;
    description: string;
    images: { url: string; display_order: number }[];
}

export const ProductService = {

  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images (
          url,
          display_order
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return data as Product[]
  },

  // Exemplo futuro: Buscar produto por ID
  async getProductById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('id', id)
      .single()
      
    if (error) throw error
    return data
  },

  // NOVO MÉTODO: Cria produto e vincula imagens (Transacional)
  async createProductWithImages(data: CreateProductDTO) {
    // 1. Cria o produto
    const { data: newProduct, error: productError } = await supabase
      .from('products')
      .insert({
        name: data.name,
        price: data.price,
        quantity: data.quantity,
        description: data.description,
      })
      .select()
      .single()

    if (productError) throw new Error('Erro ao criar produto: ' + productError.message)

    const productId = newProduct.id

    // 2. Vincula as imagens (se houver)
    if (data.images.length > 0) {
      const imagesToInsert = data.images.map(img => ({
        product_id: productId,
        url: img.url,
        display_order: img.display_order
      }))

      const { error: imagesError } = await supabase
        .from('product_images')
        .insert(imagesToInsert)

      if (imagesError) throw new Error('Erro ao salvar imagens: ' + imagesError.message)
    }

    return newProduct
  }
}