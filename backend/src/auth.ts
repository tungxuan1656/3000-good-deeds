import { decodeJwt } from 'jose'

import type { FirebaseJwtPayload, User } from './types'
import { ErrorCodes } from './utils'

export interface AuthContext {
  firebaseUid: string
  userId?: number
  user?: User
}

// Decode JWT token sử dụng jose.decodeJwt
// Lấy firebaseUid từ token (field `user_id`)
// Tạm thời chưa verify token, chỉ decode để lấy user_id
export function decodeJWTToken(token: string): {
  firebaseUid: string
  payload: FirebaseJwtPayload
} | null {
  try {
    // Sử dụng jose.decodeJwt để decode token
    const payload = decodeJwt<FirebaseJwtPayload>(token)

    // Firebase JWT có field `user_id` chứa uid của user
    const firebaseUid = payload.user_id

    if (!firebaseUid) {
      console.warn('[Auth] Token không chứa firebaseUid (user_id)')

      return null
    }

    return { firebaseUid, payload }
  } catch (error) {
    console.error('[Auth] Error decoding JWT token:', error)

    return null
  }
}

// Middleware để verify Firebase token
export async function verifyAuth(request: Request): Promise<AuthContext | null> {
  const authHeader = request.headers.get('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  // Lấy token từ header
  const token = authHeader.substring(7)

  if (!token) {
    return null
  }

  // Decode JWT token để lấy firebaseUid (tạm thời chưa verify)
  const decoded = decodeJWTToken(token)

  if (!decoded || !decoded.firebaseUid) {
    console.warn('[Auth] Failed to decode token or extract firebaseUid')

    return null
  }

  return {
    firebaseUid: decoded.firebaseUid,
  }
}

// Lấy user từ firebaseUid
export async function getUserFromFirebaseUid(
  db: D1Database,
  firebaseUid: string,
): Promise<User | null> {
  const stmt = db.prepare(`
    SELECT 
      id, firebase_uid as firebaseUid, email, display_name as displayName,
      username, avatar_url as avatarUrl, bio, birthday,
      created_at as createdAt, updated_at as updatedAt
    FROM users
    WHERE firebase_uid = ?
  `)

  const result = await stmt.bind(firebaseUid).first<User>()

  return result || null
}

// Helper để lấy auth context đầy đủ (bao gồm user info)
export async function getAuthContext(
  db: D1Database,
  request: Request,
): Promise<{ auth: AuthContext; user: User } | { error: string; code: string }> {
  const auth = await verifyAuth(request)

  if (!auth) {
    return {
      error: 'Thông tin xác thực tài khoản không hợp lệ',
      code: ErrorCodes.UNAUTHORIZED,
    }
  }

  const user = await getUserFromFirebaseUid(db, auth.firebaseUid)

  if (!user) {
    return {
      error: 'Không tìm thấy người dùng',
      code: ErrorCodes.USER_NOT_FOUND,
    }
  }

  return {
    auth: { ...auth, userId: user.id, user },
    user,
  }
}
