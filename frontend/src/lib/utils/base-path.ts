const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')

const BASE_URL = import.meta.env.BASE_URL || '/'

// '/app/' -> '/app', '/' -> ''
export const APP_BASE_PATH = BASE_URL === '/' ? '' : trimTrailingSlash(BASE_URL)

export const withBasePath = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (!APP_BASE_PATH) {
    return normalizedPath
  }

  return `${APP_BASE_PATH}${normalizedPath}`
}
