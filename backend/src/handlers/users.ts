import type { UpdateUserRequest, User } from '../types'
import { getCurrentTimestamp } from '../utils'

// SyncUser removed. Use Auth handler.

// Lấy user by ID
export async function getUser(db: D1Database, userId: string): Promise<User> {
  const user = await db
    .prepare(
      `SELECT 
        id, email, display_name as displayName,
        avatar_url as avatarUrl, bio,
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

  if (body.avatarUrl !== undefined) {
    updates.push('avatar_url = ?')
    values.push(body.avatarUrl)
  }

  if (body.bio !== undefined) {
    updates.push('bio = ?')
    values.push(body.bio)
  }

  // Settings
  if (body.reminderTime !== undefined) {
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
