import { create } from 'zustand'
import { apiClient } from '../utils/api'
import type {
  Devotion,
  DevotionCreateRequest,
  DevotionUpdateRequest,
  ApiResponse,
} from '../types/devotion'

interface DevotionState {
  devotions: Devotion[]
  currentDevotion: Devotion | null
  isLoading: boolean
  error: string | null
  fetchByMonth: (yearMonth: string) => Promise<void>
  fetchByDate: (date: string) => Promise<void>
  create: (request: DevotionCreateRequest) => Promise<Devotion>
  update: (id: string, request: DevotionUpdateRequest) => Promise<Devotion>
  remove: (id: string) => Promise<void>
  clearCurrent: () => void
}

export const useDevotionStore = create<DevotionState>((set, get) => ({
  devotions: [],
  currentDevotion: null,
  isLoading: false,
  error: null,

  fetchByMonth: async (yearMonth) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await apiClient.get<ApiResponse<Devotion[]>>(
        `/api/v1/todos?yearMonth=${yearMonth}`,
      )
      set({ devotions: data.data })
    } catch (e) {
      set({ error: '목록을 불러오지 못했습니다' })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchByDate: async (date) => {
    set({ isLoading: true, error: null, currentDevotion: null })
    try {
      const { data } = await apiClient.get<ApiResponse<Devotion>>(
        `/api/v1/todos/date/${date}`,
      )
      set({ currentDevotion: data.data })
    } catch {
      set({ currentDevotion: null })
    } finally {
      set({ isLoading: false })
    }
  },

  create: async (request) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await apiClient.post<ApiResponse<Devotion>>(
        '/api/v1/todos',
        request,
      )
      const newDevotion = data.data
      set((state) => ({ devotions: [...state.devotions, newDevotion], currentDevotion: newDevotion }))
      return newDevotion
    } finally {
      set({ isLoading: false })
    }
  },

  update: async (id, request) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await apiClient.patch<ApiResponse<Devotion>>(
        `/api/v1/todos/${id}`,
        request,
      )
      const updated = data.data
      set((state) => ({
        devotions: state.devotions.map((d) => (d.id === id ? updated : d)),
        currentDevotion: updated,
      }))
      return updated
    } finally {
      set({ isLoading: false })
    }
  },

  remove: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await apiClient.delete(`/api/v1/todos/${id}`)
      set((state) => ({
        devotions: state.devotions.filter((d) => d.id !== id),
        currentDevotion: get().currentDevotion?.id === id ? null : get().currentDevotion,
      }))
    } finally {
      set({ isLoading: false })
    }
  },

  clearCurrent: () => set({ currentDevotion: null }),
}))
