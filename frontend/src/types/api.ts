export interface ApiResponse<T> {
  success: boolean
  data: T
  error: string | null
}

export interface UserDTO {
  id: string
  email: string
  displayName: string | null
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

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export type AuthProvider = 'firebase'

export interface ProviderExchangeRequest {
  provider: AuthProvider
  idToken: string
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

export interface PaginationMeta {
  hasMore: boolean
  nextCursor: string | null
  limit: number
}

export interface DeedsResponse {
  data: DeedDTO[]
  pagination: PaginationMeta
}

export interface CreateDeedRequest {
  categoryCode: string
  description?: string
  labels?: string
  performedAt?: number
}

export interface UpdateDeedRequest {
  categoryCode?: string
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
  id: string
  category: 'body' | 'speech' | 'mind'
  name: string
  detail?: string | null
  note?: string | null
}

export interface JournalEntryDTO {
  id: string
  type: 'repentance' | 'gratitude'
  content: string
  emotion?: string
  createdAt: number
}

export interface GetJournalEntriesRequest {
  limit?: number
  cursor?: string
  type?: 'repentance' | 'gratitude'
}

export interface JournalEntriesResponse {
  data: JournalEntryDTO[]
  pagination: PaginationMeta
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

export interface GoalHistoryResponse {
  data: GoalHistoryDTO[]
  pagination: PaginationMeta
}

export interface PushSubscriptionKeysDTO {
  p256dh: string
  auth: string
}

export interface PushSubscriptionPayloadDTO {
  endpoint: string
  expirationTime?: number | null
  keys: PushSubscriptionKeysDTO
  userAgent?: string
  platform?: string
}

export type GoalType = 'weekly' | 'monthly' | 'yearly'

export interface UpsertGoalRequest {
  type: GoalType
  targetCount: number
  isEnabled: boolean
}

export interface UpsertGoalsRequest {
  goals: UpsertGoalRequest[]
}

export interface GetGoalHistoryRequest {
  limit?: number
  cursor?: string
  type?: GoalType
}

export type UpdateUserRequest = Partial<
  Pick<
    UserDTO,
    | 'displayName'
    | 'bio'
    | 'reminderTime'
    | 'reminderEnabled'
    | 'timezone'
    | 'themePreference'
    | 'privacyMode'
  >
>
