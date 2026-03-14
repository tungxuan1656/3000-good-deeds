const REQUIRES_RECENT_LOGIN_ERROR = 'auth/requires-recent-login'
const NO_FIREBASE_SESSION_ERROR = 'no-firebase-session'

export type AuthProviderErrorCode = 'requires-recent-login' | 'no-firebase-session'

export class AuthProviderError extends Error {
  code: AuthProviderErrorCode

  constructor(code: AuthProviderErrorCode, message: string) {
    super(message)
    this.name = 'AuthProviderError'
    this.code = code
  }
}

export const AUTH_PROVIDER_ERROR_MESSAGES = {
  REQUIRES_RECENT_LOGIN_ERROR,
  NO_FIREBASE_SESSION_ERROR,
} as const
