// Types cho API response
export interface ApiResponse<T = any> {
  success: boolean
  data: T | null
  error: ApiError | null
}

export interface ApiError {
  code: string
  message: string
}

// Types cho User
export interface User {
  id: number
  firebaseUid: string
  email: string
  displayName: string | null
  username: string | null
  avatarUrl: string | null
  bio: string | null
  birthday: string | null
  createdAt: number
  updatedAt: number
}

// Types cho Post
export interface Post {
  id: number
  userId: number
  mediaPublicId: string
  mediaUrl: string
  mediaType: 'image' | 'video'
  width: number | null
  height: number | null
  createdAt: number
  updatedAt: number
  deletedAt: number | null
}

// TagItem cho post attributes
export interface TagItemDTO {
  type: 'emotion' | 'location' | 'text' | 'time'
  value: string
}

export interface PostAttributes {
  postId: number
  tags: TagItemDTO[] | null
}

export interface PostWithDetails extends Post {
  user: {
    id: number
    displayName: string
    avatarUrl: string | null
  }
  tags?: TagItemDTO[]
}

// Types cho Friend
export interface Friend {
  id: number
  requester_id: number
  receiver_id: number
  status: 0 | 1 // 0: pending, 1: accepted
  createdAt: number
  updatedAt: number
}

export interface FriendWithDetails {
  id: number
  displayName: string
  email: string
  avatarUrl: string | null
}

export interface UserWithFriendStatus {
  id: number
  displayName: string
  email: string
  avatarUrl: string | null
  status: number | null // null: no relation, 0: pending, 1: accepted, 2: rejected
}

export interface FriendRequestWithDetails {
  id: number
  requester: {
    id: number
    displayName: string
    avatarUrl: string | null
    email: string
  }
  createdAt: number
}

// Types cho Reaction
export interface Reaction {
  id: number
  postId: number
  userId: number
  reactionType: string
  createdAt: number
}

// Request body types
export interface SyncUserRequest {
  firebaseUid: string
  email: string
  displayName?: string
  photoURL?: string
}

export interface UpdateUserRequest {
  displayName?: string
  avatarUrl?: string
  birthday?: string
  bio?: string
}

export interface CreatePostRequest {
  mediaPublicId: string
  mediaUrl: string
  mediaType: 'image' | 'video'
  width?: number
  height?: number
  tags?: TagItemDTO[]
  createdAt: number
}

export interface UpdatePostRequest {
  tags?: TagItemDTO[]
}

export interface CreateReactionRequest {
  reactionType: string
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
