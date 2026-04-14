import type { MetadataRoute } from 'next'

/** Ícones PWA: apenas arquivos em /public (sem duplicar em /app). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Valence Semijoias',
    short_name: 'Valence',
    description: 'Catálogo exclusivo de semijoias premium com acabamento artesanal.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafafa',
    theme_color: '#1a1a1a',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
        purpose: 'any',
      },
    ],
  }
}
