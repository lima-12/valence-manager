/**
 * URL canônica do site (SEO, Open Graph, sitemap).
 * Em produção defina NEXT_PUBLIC_SITE_URL=https://seu-dominio.com no Vercel.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (explicit) return explicit
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}
