export interface ApiResponse<T> {
  success: boolean
  data: T
  error: string | null
}

export interface UserDTO {
  id: string
  email: string
  displayName: string
  avatarUrl?: string
  bio?: string
  reminderTime?: string | null
  reminderEnabled?: boolean
  timezone?: string
  themePreference?: 'light' | 'dark' | 'system'
  privacyMode?: 'private' | 'limited'
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: UserDTO
  expiresIn: number
}

export interface LoginRequest {
  code: string
  redirectUri?: string
}

export interface DeedDTO {
  id: string
  categoryCode: string
  description?: string
  labels?: string
  performedAt: number
  createdAt: number
}

export interface DeedCategoryDTO {
  code: string
  name: string
  description?: string | null
  icon?: string
  style?: string | null
}

export interface GetDeedsRequest {
  from?: number
  to?: number
  limit?: number
}

export interface CreateDeedRequest {
  categoryCode: string
  description?: string
  labels?: string
  performedAt?: number
}

export interface DailyQuoteDTO {
  id: string
  content: string
  author: string
  source?: string
  tagsJson?: string
}

export interface RandomActDTO {
  content: string
}

export interface JournalEntryDTO {
  id: string
  type: 'repentance' | 'gratitude'
  content: string
  emotion?: string
  createdAt: number
}

export interface GetJournalRequest {
  type?: 'repentance' | 'gratitude'
}

export interface CreateJournalRequest {
  type: 'repentance' | 'gratitude'
  content: string
  emotion?: string
}

export interface StatsSummaryDTO {
  totalDeeds: number
  streakDays: number
  todayCount: number
}

export interface WeeklyRhythmDayDTO {
  date: string
  count: number
}

export interface GoalDTO {
  id: string
  type: 'daily' | 'weekly' | 'monthly'
  targetCount: number
  status: 'active' | 'completed' | 'failed'
  startDate: number
}

export interface CreateGoalRequest {
  type: 'daily' | 'weekly' | 'monthly'
  targetCount: number
}
