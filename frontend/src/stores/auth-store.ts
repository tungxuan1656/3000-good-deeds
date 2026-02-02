import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import type { AuthResponse, UserDTO } from '@/types/api'

import { createSelectors } from './types'

interface AuthState {
  isAuthenticated: boolean
  user: UserDTO | null
  accessToken: string | null
  refreshToken: string | null
}

const _useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (_) => ({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        }),
      },
    ),
  ),
)

export const authActions = {
  login: (authResponse: AuthResponse) => {
    const { accessToken, refreshToken, user } = authResponse

    // Save tokens to localStorage for API client
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    _useAuthStore.setState({
      isAuthenticated: true,
      user,
      accessToken,
      refreshToken,
    })
  },
  logout: () => {
    // Clear localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')

    _useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
    })
  },
  setUser: (user: UserDTO) => _useAuthStore.setState({ user }),
  updateAccessToken: (token: string) => {
    localStorage.setItem('accessToken', token)
    _useAuthStore.setState({ accessToken: token })
  },
}

export const useAuthStore = createSelectors(_useAuthStore)
