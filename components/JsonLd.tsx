import { getSiteUrl } from '@/lib/site-url'

/** Dados estruturados para o Google reconhecer nome do site (além do título). */
export default function JsonLd() {
  const url = getSiteUrl()
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Valence Semijoias',
    alternateName: 'Valence',
    url,
    description:
      'Catálogo exclusivo de semijoias premium com acabamento artesanal.',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
