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
  cursor?: string
}

export interface DeedsPagination {
  hasMore: boolean
  nextCursor: string | null
  limit: number
}

export interface DeedsResponse {
  data: DeedDTO[]
  pagination: DeedsPagination
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
}

export interface CalendarDayDTO {
  date: string
  count: number
}

export interface GoalDTO {
  id: string
  type: 'weekly' | 'monthly' | 'yearly'
  targetCount: number
  isEnabled: boolean
  createdAt: number
  updatedAt: number
}

export interface GoalHistoryDTO {
  id: string
  goalId: string
  type: 'weekly' | 'monthly' | 'yearly'
  periodTime: string
  targetCount: number
  actualCount: number
  completed: boolean
  startDate: number
  endDate: number
  createdAt: number
  updatedAt: number
}

export interface GoalHistoryPagination {
  hasMore: boolean
  nextCursor: string | null
  limit: number
}

export interface GoalHistoryResponse {
  data: GoalHistoryDTO[]
  pagination: GoalHistoryPagination
}

export type GoalTypeDTO = 'weekly' | 'monthly' | 'yearly'

export interface UpsertGoalRequest {
  type: GoalTypeDTO
  targetCount: number
  isEnabled: boolean
}

export interface UpsertGoalsRequest {
  goals: UpsertGoalRequest[]
}

export interface GetGoalHistoryRequest {
  limit?: number
  cursor?: string
  type?: GoalTypeDTO
}
