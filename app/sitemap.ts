import type { MetadataRoute } from 'next'
import { ProductService } from '@/services/product-service'
import { getSiteUrl } from '@/lib/site-url'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/carrinho`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  try {
    const products = await ProductService.getAllProducts()
    const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${base}/produto/${p.id}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
    return [...staticPages, ...productEntries]
  } catch {
    return staticPages
  }
}
