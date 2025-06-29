import { create } from 'zustand'
import { getCurrentUser, logout } from '@/lib/api'
import type { UserDetail } from '@/types/api'

interface AuthState {
  user: UserDetail | null
  isLoading: boolean
  fetchUser: () => Promise<void>
  handleLogout: () => Promise<void>
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,


  fetchUser: async () => {
    try {
      set({ isLoading: true })
      const response = await getCurrentUser()
      set({ user: response.data, isLoading: false })
    } catch (error) {
      console.error('Error fetching user:', error)
      set({ user: null, isLoading: false })
    }
  },

  handleLogout: async () => {
    try {
      await logout()
      set({ user: null })
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Error logging out:', error)
      set({ user: null })
      // Still redirect on error
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  },

  clearUser: () => set({ user: null })
}))