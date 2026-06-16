import { create } from 'zustand'
import type { User } from '../types'

const TOKEN_KEY = 'arya_token'
const USER_KEY = 'arya_user'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
}

// Read initial state directly from localStorage
function loadInitialState() {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const userRaw = localStorage.getItem(USER_KEY)
    if (token && userRaw) {
      const user = JSON.parse(userRaw)
      return { user, token, isAuthenticated: true }
    }
  } catch {
    // ignore
  }
  return { user: null, token: null, isAuthenticated: false }
}

export const useAuthStore = create<AuthStore>()((set) => ({
  ...loadInitialState(),

  setAuth: (user, token) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    set({ user, token, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    set({ user: null, token: null, isAuthenticated: false })
  },
}))