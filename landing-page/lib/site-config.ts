export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  'https://3000-viec-thien-landing.vercel.app'

export const IS_PRODUCTION = process.env.VERCEL_ENV === 'production'
