import { beforeEach, describe, expect, it } from 'vitest'

import { authTokenStorage } from './auth-tokens'

describe('authTokenStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('stores and retrieves access and refresh tokens', () => {
    authTokenStorage.setTokens({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    })

    expect(authTokenStorage.getAccessToken()).toBe('access-token')
    expect(authTokenStorage.getRefreshToken()).toBe('refresh-token')
  })

  it('clears persisted tokens', () => {
    authTokenStorage.setTokens({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    })

    authTokenStorage.clear()

    expect(authTokenStorage.getAccessToken()).toBeNull()
    expect(authTokenStorage.getRefreshToken()).toBeNull()
  })
})
