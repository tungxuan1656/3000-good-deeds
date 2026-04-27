const DEFAULT_SITE_URL = 'https://3000-viec-thien.vercel.app'
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0'])

const normalizeSiteUrl = (rawSiteUrl: string | undefined): string => {
  const trimmedSiteUrl = rawSiteUrl?.trim()

  if (!trimmedSiteUrl) {
    return DEFAULT_SITE_URL
  }

  try {
    const normalizedUrl = new URL(trimmedSiteUrl)

    if (
      normalizedUrl.protocol === 'http:' &&
      !LOCAL_HOSTNAMES.has(normalizedUrl.hostname)
    ) {
      normalizedUrl.protocol = 'https:'
    }

    return normalizedUrl.toString().replace(/\/$/, '')
  } catch {
    return DEFAULT_SITE_URL
  }
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)

export const IS_PRODUCTION = process.env.VERCEL_ENV === 'production'
