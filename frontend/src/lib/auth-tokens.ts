const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const canUseStorage = () => typeof window !== 'undefined'

export const authTokenStorage = {
  getAccessToken: () =>
    canUseStorage() ? localStorage.getItem(ACCESS_TOKEN_KEY) : null,
  getRefreshToken: () =>
    canUseStorage() ? localStorage.getItem(REFRESH_TOKEN_KEY) : null,
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => {
    if (!canUseStorage()) return

    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
  },
  clear: () => {
    if (!canUseStorage()) return

    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}
