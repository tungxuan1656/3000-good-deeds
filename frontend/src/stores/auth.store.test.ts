import { beforeEach, describe, expect, it } from 'vitest'

import { authTokenStorage } from '@/lib/auth-tokens'

import { authActions, useAuthStore } from './auth.store'

const user = {
  id: 'user-1',
  email: 'user@example.com',
  displayName: 'User',
}

describe('auth store actions', () => {
  beforeEach(() => {
    localStorage.clear()
    authActions.reset()
  })

  it('login sets authenticated state and persists tokens', () => {
    authActions.login({
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
      expiresIn: 86_400,
      user,
    })

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual(user)
    expect(state.accessToken).toBe('access-1')
    expect(state.refreshToken).toBe('refresh-1')

    expect(authTokenStorage.getAccessToken()).toBe('access-1')
    expect(authTokenStorage.getRefreshToken()).toBe('refresh-1')
  })

  it('updateTokens refreshes tokens and keeps authenticated state', () => {
    authActions.updateTokens({
      accessToken: 'access-next',
      refreshToken: 'refresh-next',
    })

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.accessToken).toBe('access-next')
    expect(state.refreshToken).toBe('refresh-next')

    expect(authTokenStorage.getAccessToken()).toBe('access-next')
    expect(authTokenStorage.getRefreshToken()).toBe('refresh-next')
  })

  it('logout clears state and token storage', () => {
    authActions.login({
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
      expiresIn: 86_400,
      user,
    })

    authActions.logout()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.accessToken).toBeNull()
    expect(state.refreshToken).toBeNull()

    expect(authTokenStorage.getAccessToken()).toBeNull()
    expect(authTokenStorage.getRefreshToken()).toBeNull()
  })
})
