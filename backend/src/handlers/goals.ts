import type { Goal, User } from '../types'
import { generateId, getCurrentTimestamp } from '../utils'
import {
  deleteGoalHistoryForCurrentPeriod,
  ensureGoalHistoryForCurrentPeriod,
  syncCurrentGoalHistoryTarget,
} from './goal-history'

const allowedTypes = new Set<Goal['type']>(['weekly', 'monthly', 'yearly'])

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

  return (results.results || []).map(mapGoal)
}

export async function upsertGoal(
  db: D1Database,
  user: User,
  payload: { type: string; targetCount: number; isEnabled: boolean },
): Promise<Goal> {
  const { type, targetCount, isEnabled } = payload

  if (!allowedTypes.has(type as Goal['type']) || !targetCount || isEnabled === undefined) {
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

  const updated = await db.prepare('SELECT * FROM goals WHERE id = ?').bind(goalId).first<any>()
  if (!updated) throw new Error('Không tìm thấy mục tiêu')

  const mapped = mapGoal(updated)

  if (!existing) {
    if (mapped.isEnabled) {
      await ensureGoalHistoryForCurrentPeriod(db, mapped, user.timezone)
    }

    return mapped
  }

  const wasEnabled = Boolean(existing.is_enabled)

  if (wasEnabled && !mapped.isEnabled) {
    await deleteGoalHistoryForCurrentPeriod(db, mapped, user.timezone)

    return mapped
  }

  if (!wasEnabled && mapped.isEnabled) {
    await ensureGoalHistoryForCurrentPeriod(db, mapped, user.timezone)

    return mapped
  }

  if (mapped.isEnabled && targetCount !== existing.target_count) {
    await syncCurrentGoalHistoryTarget(db, mapped, user.timezone)
  }

  return mapped
}

export async function upsertGoals(
  db: D1Database,
  user: User,
  goals: Array<{ type: string; targetCount: number; isEnabled: boolean }>,
): Promise<Goal[]> {
  const results: Goal[] = []

  for (const goal of goals) {
    results.push(await upsertGoal(db, user, goal))
  }

  return results
}
