import type { UpdateUserRequest, User } from '../types'
import { getCurrentTimestamp } from '../utils'

export class UserHandlerError extends Error {
  status: 400 | 404 | 500

  constructor(message: string, status: 400 | 404 | 500) {
    super(message)
    this.name = 'UserHandlerError'
    this.status = status
  }
}

// SyncUser removed. Use Auth handler.

// Lấy user by ID
export async function getUser(db: D1Database, userId: string): Promise<User> {
  const user = await db
    .prepare(
      `SELECT 
        id, email, display_name as displayName,
        bio,
        reminder_time as reminderTime, reminder_enabled as reminderEnabled,
        timezone, theme_preference as themePreference, privacy_mode as privacyMode,
        created_at as createdAt, updated_at as updatedAt
      FROM users
      WHERE id = ?`,
    )
    .bind(userId)
    .first<User>()

  if (!user) {
    throw new Error('Không tìm thấy người dùng')
  }

  // Convert boolean fields manually because SQLite stores them as 0/1
  return {
    ...user,
    reminderEnabled: Boolean(user.reminderEnabled),
  }
}

// Update user profile
export async function updateUser(
  db: D1Database,
  userId: string,
  body: UpdateUserRequest,
): Promise<User> {
  const now = getCurrentTimestamp()
  const updates: string[] = []
  const values: any[] = []

  if (body.displayName !== undefined) {
    updates.push('display_name = ?')
    values.push(body.displayName)
  }

  if (body.bio !== undefined) {
    updates.push('bio = ?')
    values.push(body.bio)
  }

  // Settings
  if (body.reminderTime !== undefined) {
    // Validate HH:mm format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(body.reminderTime)) {
      throw new Error('Định dạng thời gian nhắc nhở không hợp lệ. Vui lòng dùng HH:mm')
    }
    updates.push('reminder_time = ?')
    values.push(body.reminderTime)
  }

  if (body.reminderEnabled !== undefined) {
    updates.push('reminder_enabled = ?')
    values.push(body.reminderEnabled ? 1 : 0)
  }

  if (body.timezone !== undefined) {
    updates.push('timezone = ?')
    values.push(body.timezone)
  }

  if (body.themePreference !== undefined) {
    updates.push('theme_preference = ?')
    values.push(body.themePreference)
  }

  if (body.privacyMode !== undefined) {
    updates.push('privacy_mode = ?')
    values.push(body.privacyMode)
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

export async function deleteUserAccount(db: D1Database, userId: string): Promise<boolean> {
  const result = await db.prepare('DELETE FROM users WHERE id = ?').bind(userId).run()

  if ((result.meta?.changes ?? 0) === 0) {
    throw new UserHandlerError('Không tìm thấy người dùng', 404)
  }

  return true
}
