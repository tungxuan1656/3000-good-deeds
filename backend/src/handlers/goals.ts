import type { Goal, User } from '../types'
import { generateId, getCurrentTimestamp } from '../utils'
import { ensureGoalHistoryForCurrentPeriod, syncCurrentGoalHistoryTarget } from './goal-history'

const allowedTypes = new Set<Goal['type']>(['weekly', 'monthly', 'yearly', 'milestone'])

const mapGoal = (row: any): Goal => {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    targetCount: row.target_count,
    isEnabled: Boolean(row.is_enabled),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getGoals(db: D1Database, user: User): Promise<Array<Goal>> {
  const results = await db
    .prepare(`SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC`)
    .bind(user.id)
    .all<any>()

  const goals = (results.results || []).map(mapGoal)

  await Promise.all(
    goals.map(async (goal) => {
      if (goal.isEnabled) {
        await ensureGoalHistoryForCurrentPeriod(db, goal, user.timezone)
      }
    }),
  )

  return goals
}

export async function upsertGoal(
  db: D1Database,
  user: User,
  payload: { type: string; targetCount?: number; isEnabled?: boolean },
): Promise<Goal> {
  const { type, targetCount, isEnabled } = payload

  if (
    !allowedTypes.has(type as Goal['type']) ||
    targetCount === undefined ||
    isEnabled === undefined ||
    targetCount <= 0
  ) {
    throw new Error('Thông tin mục tiêu không hợp lệ')
  }

  const now = getCurrentTimestamp()
  const existing = await db
    .prepare('SELECT * FROM goals WHERE user_id = ? AND type = ?')
    .bind(user.id, type)
    .first<any>()

  const goalId = existing?.id ?? generateId()
  if (!existing) {
    await db
      .prepare(
        `INSERT INTO goals (id, user_id, type, target_count, is_enabled, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(goalId, user.id, type, targetCount, isEnabled ? 1 : 0, now, now)
      .run()
  } else {
    await db
      .prepare(
        `UPDATE goals SET target_count = ?, is_enabled = ?, updated_at = ? WHERE id = ? AND user_id = ?`,
      )
      .bind(targetCount, isEnabled ? 1 : 0, now, goalId, user.id)
      .run()
  }

  const updated = await db
    .prepare('SELECT * FROM goals WHERE id = ?')
    .bind(existing.id)
    .first<any>()
  if (!updated) throw new Error('Không tìm thấy mục tiêu')

  const mapped = mapGoal(updated)
  if (mapped.isEnabled) {
    await syncCurrentGoalHistoryTarget(db, mapped, user.timezone)
  }

  return mapped
}
