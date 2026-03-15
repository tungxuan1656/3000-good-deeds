export interface ApiResponse<T = any> {
  success: boolean
  data: T | null
  error: ApiError | null
}

export interface ApiError {
  code: string
  message: string
}

// User Entity
export interface User {
  id: string
  email: string
  displayName: string | null
  bio: string | null
  createdAt: number
  updatedAt: number
  // Settings
  reminderTime: string | null
  reminderEnabled: boolean
  timezone: string
  themePreference: 'light' | 'dark' | 'system'
  privacyMode: 'private' | 'limited'
}

// Good Deed Entity
export interface GoodDeed {
  id: string
  userId: string
  description: string | null
  labels?: string | null
  performedAt: number
  createdAt: number
  updatedAt: number
}

// Goal Entity
export interface Goal {
  id: string
  userId: string
  type: 'weekly' | 'monthly' | 'yearly'
  targetCount: number
  isEnabled: boolean
  createdAt: number
  updatedAt: number
}

export interface GoalHistory {
  id: string
  goalId: string
  userId: string
  type: 'weekly' | 'monthly' | 'yearly'
  periodTime: string
  targetCount: number
  actualCount: number
  startDate: number
  endDate: number | null
  completed: boolean
  createdAt: number
  updatedAt: number
}

// Stats DTO
export interface UserStats {
  totalDeeds: number
  streakDays: number
}

// Request Types
export interface CreateDeedRequest {
  description?: string
  labels?: string
  performedAt?: number // defaults to now
}

export interface UpdateDeedRequest {
  description?: string
  labels?: string
  performedAt?: number
}

// Auth Types
export type IdentityProvider = 'firebase'

export interface ProviderExchangeRequest {
  provider: IdentityProvider
  idToken: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
  expiresIn: number
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface LogoutRequest {
  refreshToken?: string
}

export interface UpdateUserRequest {
  displayName?: string
  bio?: string
  // Settings
  reminderTime?: string
  reminderEnabled?: boolean
  timezone?: string
  themePreference?: 'light' | 'dark' | 'system'
  privacyMode?: 'private' | 'limited'
}

export interface UpdateGoalRequest {
  targetCount?: number
  isEnabled?: boolean
}

export interface PushSubscriptionKeys {
  p256dh: string
  auth: string
}

export interface PushSubscriptionPayload {
  endpoint: string
  expirationTime?: number | null
  keys: PushSubscriptionKeys
  userAgent?: string
  platform?: string
}

export interface FirebaseJwtPayload {
  name?: string
  picture?: string
  iss: string
  aud: string
  auth_time: number
  user_id: string
  sub: string
  iat: number
  exp: number
  email?: string
  email_verified?: boolean
  firebase?: {
    identities: Record<string, string[]>
    sign_in_provider: string
  }
}

// Cultivation Entities
export interface DharmaQuote {
  id: string
  content: string
  author: string | null
  source: string | null
  createdAt: number
  updatedAt: number
}

export interface JournalEntry {
  id: string
  userId: string
  type: 'repentance' | 'gratitude'
  content: string
  emotion: string | null
  isPrivate: boolean
  createdAt: number
  updatedAt: number
}

// Cultivation Requests
export interface CreateJournalRequest {
  type: 'repentance' | 'gratitude'
  content: string
  emotion?: string
}

export interface RandomAct {
  id: string
  name: string
  detail: string | null
  note: string | null
  createdAt: number
  updatedAt: number
}

export interface CalendarDay {
  date: string
  count: number
}

export type DateParts = {
  year: number
  month: number
  day: number
}

export type GoalType = Goal['type']

export type DeedPeriods = {
  localWeek: string
  localMonth: string
  localYear: string
}
