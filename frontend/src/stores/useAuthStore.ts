import { create } from 'zustand'
import { apiClient } from '../utils/api'
import { supabase } from '../utils/supabase'
import type { AuthResponse, LoginRequest, SignupRequest } from '../types/auth'
import type { ApiResponse } from '../types/devotion'

interface AuthState {
  userId: string | null
  email: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (request: LoginRequest) => Promise<void>
  signup: (request: SignupRequest) => Promise<void>
  loginWithProvider: (provider: 'google' | 'kakao') => Promise<void>
  logout: () => void
  initAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  email: null,
  isAuthenticated: false,
  isLoading: false,

  initAuth: () => {
    const token = localStorage.getItem('accessToken')
    const userId = localStorage.getItem('userId')
    const email = localStorage.getItem('email')
    if (token && userId && email) {
      set({ userId, email, isAuthenticated: true })
    }
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
      set({ userId, email, isAuthenticated: true })
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
    set({ userId: null, email: null, isAuthenticated: false })
  },
}))
