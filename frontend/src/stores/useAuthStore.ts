import { create } from 'zustand'
import { apiClient } from '../utils/api'
import { supabase } from '../utils/supabase'
import type { AuthResponse, LoginRequest, SignupRequest } from '../types/auth'
import type { ApiResponse } from '../types/devotion'

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

interface AuthState {
  userId: string | null
  email: string | null
  isAuthenticated: boolean
  isInitializing: boolean
  isLoading: boolean
  isAdmin: boolean
  login: (request: LoginRequest) => Promise<void>
  signup: (request: SignupRequest) => Promise<void>
  loginWithProvider: (provider: 'google' | 'kakao') => Promise<void>
  logout: () => void
  initAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  email: null,
  isAuthenticated: false,
  isInitializing: true,
  isLoading: false,
  isAdmin: false,

  initAuth: async () => {
    const token = localStorage.getItem('accessToken')
    const userId = localStorage.getItem('userId')
    const email = localStorage.getItem('email')

    if (token && userId && email && !isTokenExpired(token)) {
      set({ userId, email, isAuthenticated: true })
      try {
        const { data } = await apiClient.get<ApiResponse<{ isAdmin: boolean }>>('/api/v1/admin/check')
        set({ isAdmin: data.data.isAdmin })
      } catch {
        set({ isAdmin: false })
      }
    } else if (token && isTokenExpired(token)) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userId')
      localStorage.removeItem('email')
    }

    set({ isInitializing: false })
  },

  login: async (request) => {
    set({ isLoading: true })
    try {
      const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
        '/api/v1/auth/login',
        request,
      )
      const { accessToken, refreshToken, userId, email } = data.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('userId', userId)
      localStorage.setItem('email', email)
      set({ userId, email, isAuthenticated: true })
      try {
        const adminRes = await apiClient.get<ApiResponse<{ isAdmin: boolean }>>('/api/v1/admin/check')
        set({ isAdmin: adminRes.data.data.isAdmin })
      } catch {
        set({ isAdmin: false })
      }
    } finally {
      set({ isLoading: false })
    }
  },

  signup: async (request) => {
    set({ isLoading: true })
    try {
      const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
        '/api/v1/auth/signup',
        request,
      )
      const { accessToken, refreshToken, userId, email } = data.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('userId', userId)
      localStorage.setItem('email', email)
      set({ userId, email, isAuthenticated: true, isAdmin: false })
    } finally {
      set({ isLoading: false })
    }
  },

  loginWithProvider: async (provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userId')
    localStorage.removeItem('email')
    set({ userId: null, email: null, isAuthenticated: false, isAdmin: false })
  },
}))
