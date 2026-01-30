import type { SyncUserRequest, UpdateUserRequest, User } from '../types'
import { getCurrentTimestamp } from '../utils'

// Sync user từ Firebase về D1
export async function syncUser(db: D1Database, body: SyncUserRequest): Promise<User> {
  const now = getCurrentTimestamp()

  // Kiểm tra user đã tồn tại chưa
  const existingUser = await db
    .prepare('SELECT id FROM users WHERE firebase_uid = ?')
    .bind(body.firebaseUid)
    .first<{ id: number }>()

  let userId = existingUser ? existingUser.id : 0

  if (!existingUser) {
    // Tạo user mới
    const insertResult = await db
      .prepare(
        `INSERT INTO users (firebase_uid, email, display_name, avatar_url, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .bind(body.firebaseUid, body.email, body.displayName || null, body.photoURL || null, now, now)
      .run()

    userId = insertResult.meta.last_row_id as number
  }

  // Lấy user info
  return await getUser(db, userId)
}

// Lấy user by ID
export async function getUser(db: D1Database, userId: number): Promise<User> {
  const user = await db
    .prepare(
      `SELECT 
        id, firebase_uid as firebaseUid, email, display_name as displayName,
        avatar_url as avatarUrl, bio,
        created_at as createdAt, updated_at as updatedAt
      FROM users
      WHERE id = ?`,
    )
    .bind(userId)
    .first<User>()

  if (!user) {
    throw new Error('Không tìm thấy người dùng')
  }

  return user
}

// Update user profile
export async function updateUser(
  db: D1Database,
  userId: number,
  body: UpdateUserRequest,
): Promise<User> {
  const now = getCurrentTimestamp()
  const updates: string[] = []
  const values: any[] = []

  if (body.displayName !== undefined) {
    updates.push('display_name = ?')
    values.push(body.displayName)
  }

  if (body.avatarUrl !== undefined) {
    updates.push('avatar_url = ?')
    values.push(body.avatarUrl)
  }

  if (body.bio !== undefined) {
    updates.push('bio = ?')
    values.push(body.bio)
  }

  if (updates.length > 0) {
    updates.push('updated_at = ?')
    values.push(now)
    values.push(userId)

    await db
      .prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`)
      .bind(...values)
      .run()
  }

  return await getUser(db, userId)
}
