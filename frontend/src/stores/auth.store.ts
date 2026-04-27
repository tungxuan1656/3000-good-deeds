import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import { authTokenStorage } from '@/lib/auth-tokens'
import type { AuthResponse, UserDTO } from '@/types/api'

import { createSelectors } from './types'

interface AuthState {
  isAuthenticated: boolean
  user: UserDTO | null
  accessToken: string | null
  refreshToken: string | null
  _hasHydrated: boolean
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  _hasHydrated: false,
}

const createAuthStorage = () => {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => undefined,
      removeItem: () => undefined,
    }
  }

  return localStorage
}

const applyAuthenticatedSession = (payload: {
  accessToken: string
  refreshToken: string
  user: UserDTO
}) => {
  authTokenStorage.setTokens({
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
  })

  _useAuthStore.setState({
    isAuthenticated: true,
    user: payload.user,
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
  })
}

const _useAuthStore = create<AuthState>()(
  devtools(
    persist(() => initialState, {
      name: 'auth-storage',
      storage: createJSONStorage(createAuthStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }),
  ),
)

const syncTokenStorageFromStore = () => {
  const { accessToken, refreshToken } = _useAuthStore.getState()

  if (accessToken && refreshToken) {
    authTokenStorage.setTokens({ accessToken, refreshToken })

    return
  }

  authTokenStorage.clear()
}

if (typeof window !== 'undefined' && _useAuthStore.persist.hasHydrated()) {
  syncTokenStorageFromStore()
  _useAuthStore.setState({ _hasHydrated: true })
}

if (typeof window !== 'undefined') {
  _useAuthStore.persist.onFinishHydration(() => {
    syncTokenStorageFromStore()
    _useAuthStore.setState({ _hasHydrated: true })
  })
}

export const authActions = {
  login: (authResponse: AuthResponse) => {
    applyAuthenticatedSession(authResponse)
  },
  logout: () => {
    authTokenStorage.clear()

    _useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
    })
  },
  setUser: (user: UserDTO) => _useAuthStore.setState({ user }),
  updateTokens: (tokens: { accessToken: string; refreshToken: string }) => {
    authTokenStorage.setTokens(tokens)

    _useAuthStore.setState({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      isAuthenticated: true,
    })
  },
  reset: () => {
    authTokenStorage.clear()

    _useAuthStore.setState({
      ...initialState,
      _hasHydrated: true,
    })
  },
}

export const useAuthStore = createSelectors(_useAuthStore)
