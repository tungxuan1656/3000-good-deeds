const WEBAPP_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.trim() ||
  'https://3000-viec-thien.vercel.app/app/'

export function buildWebAppCtaUrl(content: string): string {
  const url = new URL(WEBAPP_BASE_URL)

  url.searchParams.set('utm_source', 'landing-page')
  url.searchParams.set('utm_medium', 'cta')
  url.searchParams.set('utm_campaign', 'seo_launch')
  url.searchParams.set('utm_content', content)

  return url.toString()
}
