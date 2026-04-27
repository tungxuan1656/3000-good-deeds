const buildInternalPath = (path = '') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return new URL(normalizedPath, 'https://internal.local').pathname
}

export function getWebAppHomeUrl(): string {
  return '/home'
}

export function getWebAppLoginUrl(): string {
  return '/login'
}

export function buildWebAppCtaUrl(content: string, path = ''): string {
  const pathname = path ? buildInternalPath(path) : '/home'
  const searchParams = new URLSearchParams({
    utm_source: 'landing-page',
    utm_medium: 'cta',
    utm_campaign: 'seo_launch',
    utm_content: content,
  })

  return `${pathname}?${searchParams.toString()}`
}
