import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import type { AuthResponse, SessionResponse, UserDTO } from '@/types/api'

import { createSelectors } from './types'

interface AuthState {
  isSessionChecked: boolean
  isAuthenticated: boolean
  user: UserDTO | null
  accessToken: string | null
}

const _useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (_) => ({
        isSessionChecked: false,
        isAuthenticated: false,
        user: null,
        accessToken: null,
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
          accessToken: state.accessToken,
        }),
      },
    ),
  ),
)

export const authActions = {
  markSessionChecked: (checked = true) => _useAuthStore.setState({ isSessionChecked: checked }),
  login: (authResponse: AuthResponse) => {
    const { accessToken, user } = authResponse

    // Save access token for API client
    localStorage.setItem('accessToken', accessToken)

    _useAuthStore.setState({
      isAuthenticated: true,
      isSessionChecked: true,
      user,
      accessToken,
    })
  },
  restoreSession: (sessionResponse: SessionResponse) => {
    const { accessToken, user } = sessionResponse

    localStorage.setItem('accessToken', accessToken)

    _useAuthStore.setState({
      isAuthenticated: true,
      isSessionChecked: true,
      user,
      accessToken,
    })
  },
  logout: () => {
    // Clear localStorage
    localStorage.removeItem('accessToken')

    _useAuthStore.setState({
      isAuthenticated: false,
      isSessionChecked: true,
      user: null,
      accessToken: null,
    })
  },
  setUser: (user: UserDTO) => _useAuthStore.setState({ user }),
  updateAccessToken: (token: string) => {
    localStorage.setItem('accessToken', token)
    _useAuthStore.setState({ accessToken: token })
  },
}

export const useAuthStore = createSelectors(_useAuthStore)
