import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AuthResponse, UserDTO } from '@/types/api'

interface AuthState {
  isAuthenticated: boolean
  user: UserDTO | null
  accessToken: string | null
  refreshToken: string | null

  // Actions
  login: (authResponse: AuthResponse) => void
  logout: () => void
  setUser: (user: UserDTO) => void
  updateAccessToken: (token: string) => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,

      login: (authResponse: AuthResponse) => {
        const { accessToken, refreshToken, user } = authResponse

        // Save tokens to localStorage for API client
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)

        set({
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

        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        })
      },

      setUser: (user: UserDTO) => set({ user }),

      updateAccessToken: (token: string) => {
        localStorage.setItem('accessToken', token)
        set({ accessToken: token })
      },
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
)

export default useAuthStore
