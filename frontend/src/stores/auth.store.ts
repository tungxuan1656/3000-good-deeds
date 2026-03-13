import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import type { AuthResponse, UserDTO } from '@/types/api'

import { createSelectors } from './types'

interface AuthState {
  isSessionChecked: boolean
  isAuthenticated: boolean
  user: UserDTO | null
  accessToken: string | null
}

const initialState: AuthState = {
  isSessionChecked: false,
  isAuthenticated: false,
  user: null,
  accessToken: null,
}

const setAccessTokenStorage = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken)
}

const removeAccessTokenStorage = () => {
  localStorage.removeItem('accessToken')
}

const applyAuthenticatedSession = (payload: { accessToken: string; user: UserDTO }) => {
  setAccessTokenStorage(payload.accessToken)

  _useAuthStore.setState({
    isAuthenticated: true,
    isSessionChecked: true,
    user: payload.user,
    accessToken: payload.accessToken,
  })
}

const _useAuthStore = create<AuthState>()(
  devtools(
    persist(() => initialState, {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
      }),
    }),
  ),
)

export const authActions = {
  markSessionChecked: (checked = true) => _useAuthStore.setState({ isSessionChecked: checked }),
  login: (authResponse: AuthResponse) => {
    applyAuthenticatedSession(authResponse)
  },
  restoreSession: (sessionResponse: AuthResponse) => {
    applyAuthenticatedSession(sessionResponse)
  },
  logout: () => {
    removeAccessTokenStorage()

    _useAuthStore.setState({
      isAuthenticated: false,
      isSessionChecked: true,
      user: null,
      accessToken: null,
    })
  },
  setUser: (user: UserDTO) => _useAuthStore.setState({ user }),
  updateAccessToken: (token: string) => {
    setAccessTokenStorage(token)
    _useAuthStore.setState({ accessToken: token })
  },
  reset: () => {
    removeAccessTokenStorage()
    _useAuthStore.setState(initialState)
  },
}

export const useAuthStore = createSelectors(_useAuthStore)
