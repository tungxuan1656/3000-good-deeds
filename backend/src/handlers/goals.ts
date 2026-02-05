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

export async function createGoal(
  db: D1Database,
  user: User,
  type: string,
  targetCount: number,
): Promise<Goal> {
  if (!allowedTypes.has(type as Goal['type'])) {
    throw new Error('Loại mục tiêu không hợp lệ')
  }

  if (targetCount <= 0) {
    throw new Error('Số lượng mục tiêu không hợp lệ')
  }

  const now = getCurrentTimestamp()
  const existing = await db
    .prepare('SELECT * FROM goals WHERE user_id = ? AND type = ?')
    .bind(user.id, type)
    .first<any>()

  let goalId = existing?.id

  if (existing) {
    await db
      .prepare(
        `UPDATE goals SET target_count = ?, is_enabled = 1, updated_at = ?
         WHERE id = ? AND user_id = ?`,
      )
      .bind(targetCount, now, existing.id, user.id)
      .run()
  } else {
    goalId = generateId()

    await db
      .prepare(
        `INSERT INTO goals (id, user_id, type, target_count, is_enabled, created_at, updated_at)
         VALUES (?, ?, ?, ?, 1, ?, ?)`,
      )
      .bind(goalId, user.id, type, targetCount, now, now)
      .run()
  }

  const goal = await db.prepare(`SELECT * FROM goals WHERE id = ?`).bind(goalId).first<any>()

  if (!goal) throw new Error('Tạo mục tiêu thất bại')

  const mapped = mapGoal(goal)

  await syncCurrentGoalHistoryTarget(db, mapped, user.timezone)

  return mapped
}

export async function updateGoal(
  db: D1Database,
  user: User,
  goalId: string,
  updates: { targetCount?: number; isEnabled?: boolean },
): Promise<Goal> {
  if (updates.targetCount !== undefined && updates.targetCount <= 0) {
    throw new Error('Số lượng mục tiêu không hợp lệ')
  }

  const setClauses: string[] = []
  const values: any[] = []

  if (updates.targetCount !== undefined) {
    setClauses.push('target_count = ?')
    values.push(updates.targetCount)
  }

  if (updates.isEnabled !== undefined) {
    setClauses.push('is_enabled = ?')
    values.push(updates.isEnabled ? 1 : 0)
  }

  if (setClauses.length === 0) {
    throw new Error('Không có thông tin cập nhật')
  }

  setClauses.push('updated_at = ?')
  values.push(getCurrentTimestamp())

  values.push(goalId)
  values.push(user.id) // Ensure ownership

  const res = await db
    .prepare(`UPDATE goals SET ${setClauses.join(', ')} WHERE id = ? AND user_id = ?`)
    .bind(...values)
    .run()

  if (res.meta.changes === 0) {
    throw new Error('Không tìm thấy mục tiêu hoặc không có quyền truy cập')
  }

  const goal = await db.prepare('SELECT * FROM goals WHERE id = ?').bind(goalId).first<any>()
  if (!goal) throw new Error('Không tìm thấy mục tiêu')

  const mapped = mapGoal(goal)

  if (updates.targetCount !== undefined || updates.isEnabled !== undefined) {
    await syncCurrentGoalHistoryTarget(db, mapped, user.timezone)
  }

  return mapped
}

export async function deleteGoal(db: D1Database, user: User, goalId: string): Promise<boolean> {
  const res = await db
    .prepare('DELETE FROM goals WHERE id = ? AND user_id = ?')
    .bind(goalId, user.id)
    .run()

  return res.meta.changes > 0
}
