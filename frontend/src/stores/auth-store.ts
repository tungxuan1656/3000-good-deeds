import { create } from 'zustand'

interface UserProfile {
  id?: string
  name?: string
  email?: string
  avatarUrl?: string
}

interface UserPreferences {
  language: 'vi' | 'en'
  remindersEnabled: boolean
  reminderTime?: string
}

interface AuthState {
  isAuthenticated: boolean
  user: UserProfile | null
  preferences: UserPreferences
  setAuthenticated: (value: boolean) => void
  setUser: (user: UserProfile | null) => void
  updatePreferences: (updates: Partial<UserPreferences>) => void
  signOut: () => void
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  preferences: {
    language: 'vi',
    remindersEnabled: true,
  },
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user }),
  updatePreferences: (updates) =>
    set((state) => ({ preferences: { ...state.preferences, ...updates } })),
  signOut: () => set({ isAuthenticated: false, user: null }),
}))

export default useAuthStore
