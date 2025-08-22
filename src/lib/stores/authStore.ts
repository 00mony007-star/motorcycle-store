import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '../types'
import { getApi } from '../api'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: Pick<User, 'name' | 'email'> & {password: string}) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const api = getApi()

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true, // Start with loading true to check auth on init

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const { user } = await api.users.login(email, password)
          set({ user, isAuthenticated: true, isLoading: false })
          return { success: true }
        } catch (error: any) {
          set({ isLoading: false })
          return { success: false, error: error.message || 'Login failed' }
        }
      },

      register: async (userData) => {
        set({ isLoading: true })
        try {
          const { user } = await api.users.register(userData)
          set({ user, isAuthenticated: true, isLoading: false })
          return { success: true }
        } catch (error: any) {
          set({ isLoading: false })
          return { success: false, error: error.message || 'Registration failed' }
        }
      },

      logout: async () => {
        await api.users.logout()
        set({ user: null, isAuthenticated: false })
      },

      checkAuth: async () => {
        set({ isLoading: true })
        try {
          const user = await api.users.me()
          if (user) {
            set({ user, isAuthenticated: true, isLoading: false })
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false })
          }
        } catch (error) {
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Only persist non-sensitive, non-function properties
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
