import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: '3000 Việc Thiện',
    short_name: '3000 Việc Thiện',
    description: '3000 Việc Thiện - Nơi để bạn tu tập',
    start_url: '/home',
    scope: '/',
    dir: 'ltr',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    background_color: '#F6F3EE',
    theme_color: '#F6F3EE',
    orientation: 'portrait',
    lang: 'vi',
    categories: ['lifestyle', 'education', 'productivity'],
    prefer_related_applications: false,
    icons: [
      { src: '/pwa-64x64.png', sizes: '64x64', type: 'image/png' },
      { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
