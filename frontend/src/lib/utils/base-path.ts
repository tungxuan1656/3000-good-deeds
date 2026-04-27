export const APP_BASE_PATH = ''

export const withBasePath = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return normalizedPath
}
