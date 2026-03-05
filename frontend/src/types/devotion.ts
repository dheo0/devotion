export interface Devotion {
  id: string
  userId: string
  date: string
  title: string | null
  bibleVerse: string | null
  summary: string | null
  givenWord: string | null
  aboutGod: string | null
  aboutMe: string | null
  actionItems: string | null
  createdAt: string
  updatedAt: string
}

export interface DevotionCreateRequest {
  date: string
  title?: string
  bibleVerse?: string
  summary?: string
  givenWord?: string
  aboutGod?: string
  aboutMe?: string
  actionItems?: string
}

export interface DevotionUpdateRequest {
  date?: string
  title?: string
  bibleVerse?: string
  summary?: string
  givenWord?: string
  aboutGod?: string
  aboutMe?: string
  actionItems?: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string | null
}
