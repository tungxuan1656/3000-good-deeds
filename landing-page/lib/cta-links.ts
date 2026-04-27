const WEBAPP_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.trim() ||
  'https://3000-viec-thien.vercel.app/app/'

const WEBAPP_LOGIN_URL = new URL('login', WEBAPP_BASE_URL).toString()

export function getWebAppHomeUrl(): string {
  return WEBAPP_BASE_URL
}

export function getWebAppLoginUrl(): string {
  return WEBAPP_LOGIN_URL
}

export function buildWebAppCtaUrl(content: string, path = ''): string {
  const url = new URL(path, WEBAPP_BASE_URL)

  url.searchParams.set('utm_source', 'landing-page')
  url.searchParams.set('utm_medium', 'cta')
  url.searchParams.set('utm_campaign', 'seo_launch')
  url.searchParams.set('utm_content', content)

  return url.toString()
}
