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
    id: number
    firebaseUid: string
    email: string
    displayName: string | null
    avatarUrl: string | null
    bio: string | null
    createdAt: number
    updatedAt: number
}

// Category Entity
export interface Category {
    id: number
    name: string
    description: string | null
    icon: string | null
    color: string | null
    isActive: boolean
    createdAt: number
}

// Good Deed Entity
export interface GoodDeed {
    id: number
    userId: number
    categoryId: number
    description: string | null
    performedAt: number
    createdAt: number
    updatedAt: number
    // Expanded
    category?: Category
}

// Goal Entity
export interface Goal {
    id: number
    userId: number
    type: 'daily' | 'weekly' | 'monthly'
    targetCount: number
    startDate: number
    endDate: number | null
    status: 'active' | 'completed' | 'archived'
    createdAt: number
    updatedAt: number
}

// Achievement Entity
export interface AchievementDefinition {
    id: string
    name: string
    description: string
    criteriaType: 'count' | 'streak'
    criteriaValue: number
    icon: string | null
}

export interface UserAchievement {
    id: number
    userId: number
    achievementId: string
    earnedAt: number
    // Expanded
    details?: AchievementDefinition
}

// Stats DTO
export interface UserStats {
    totalDeeds: number
    streakDays: number
    todayCount: number
}

// Request Types
export interface CreateDeedRequest {
    categoryId: number
    description?: string
    performedAt?: number // defaults to now
}

export interface UpdateDeedRequest {
    categoryId?: number
    description?: string
    performedAt?: number
}

export interface SyncUserRequest {
    firebaseUid: string
    email: string
    displayName?: string
    photoURL?: string
}

export interface UpdateUserRequest {
    displayName?: string
    avatarUrl?: string
    bio?: string
}

export interface UpdateGoalRequest {
    targetCount?: number
    status?: 'active' | 'completed' | 'archived'
    endDate?: number
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

