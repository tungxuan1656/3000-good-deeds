const WEBAPP_BASE_URL = 'https://3000-viec-thien.web.app/'

export function buildWebAppCtaUrl(content: string): string {
  const url = new URL(WEBAPP_BASE_URL)

  url.searchParams.set('utm_source', 'landing-page')
  url.searchParams.set('utm_medium', 'cta')
  url.searchParams.set('utm_campaign', 'seo_launch')
  url.searchParams.set('utm_content', content)

  return url.toString()
}
