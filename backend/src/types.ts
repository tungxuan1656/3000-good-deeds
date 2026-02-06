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
  googleId?: string // or generic provider_id
  email: string
  displayName: string | null
  avatarUrl: string | null
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

// Category Entity
export interface Category {
  code: string
  name: string
  description: string | null
  icon: string | null
  isActive: boolean
  style: string | null
  createdAt: number
}

// Good Deed Entity
export interface GoodDeed {
  id: string
  userId: string
  categoryCode: string
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
  categoryCode: string
  description?: string
  labels?: string
  performedAt?: number // defaults to now
}

export interface UpdateDeedRequest {
  categoryCode?: string
  description?: string
  labels?: string
  performedAt?: number
}

// Auth Types
export interface GoogleAuthRequest {
  code: string
  redirectUri?: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
  expiresIn: number
}

export interface GoogleTokenResponse {
  access_token: string
  expires_in: number
  refresh_token?: string
  scope: string
  token_type: string
  id_token: string
}

export interface GoogleUserInfo {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

export interface UpdateUserRequest {
  displayName?: string
  avatarUrl?: string
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
  content: string
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
