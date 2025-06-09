import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
  _id: number
  name: string
  email: string
  password: string
  role: string
  created_at: string
  updated_at: string
}

type AuthState = {
  user: User | null
  token: string | null
  permissions: null | { permissions: number }
  setUser: (user: User) => void
  setToken: (token: string) => void
  setPermissions: (permissions: { permissions: number }) => void
  clearAuth: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      permissions: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setPermissions: (permissions) => set({ permissions }),
      clearAuth: () => set({ user: null, token: null, permissions: null }),
    }),
    {
      name: 'auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        permissions: state.permissions,
      }),
    }
  )
)

export default useAuthStore
