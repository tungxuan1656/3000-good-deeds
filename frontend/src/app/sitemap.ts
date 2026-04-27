import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/site-config'

const ROUTES = [
  '/',
  '/login',
  '/home',
  '/timeline',
  '/handbook',
  '/progress',
  '/more',
]

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified: new Date(),
  }))
}
