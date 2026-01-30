import type { Goal } from '../types'
import { getCurrentTimestamp } from '../utils'

export async function getGoals(db: D1Database, userId: string): Promise<Goal[]> {
  const results = await db
    .prepare(`SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC`)
    .bind(userId)
    .all<Goal>()

  return results.results || []
}

export async function createGoal(
  db: D1Database,
  userId: string,
  type: string,
  targetCount: number,
): Promise<Goal> {
  const now = getCurrentTimestamp()
  const startDate = now // Simple start date = created_at
  const newId = crypto.randomUUID()

  await db
    .prepare(
      `INSERT INTO goals (id, user_id, type, target_count, start_date, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
    )
    .bind(newId, userId, type, targetCount, startDate, now, now)
    .run()

  const goal = await db.prepare(`SELECT * FROM goals WHERE id = ?`).bind(newId).first<Goal>()

  if (!goal) throw new Error('Create goal failed')

  return goal
}

export async function updateGoal(
  db: D1Database,
  userId: string,
  goalId: string,
  updates: { targetCount?: number; status?: 'active' | 'completed' | 'archived'; endDate?: number },
): Promise<Goal> {
  const setClauses: string[] = []
  const values: any[] = []

  if (updates.targetCount !== undefined) {
    setClauses.push('target_count = ?')
    values.push(updates.targetCount)
  }

  if (updates.status !== undefined) {
    setClauses.push('is_active = ?')
    values.push(updates.status === 'active' ? 1 : 0)
  }

  if (updates.endDate !== undefined) {
    setClauses.push('end_date = ?')
    values.push(updates.endDate)
  }

  if (setClauses.length === 0) {
    throw new Error('No updates provided')
  }

  setClauses.push('updated_at = ?')
  values.push(getCurrentTimestamp())

  values.push(goalId)
  values.push(userId) // Ensure ownership

  const res = await db
    .prepare(`UPDATE goals SET ${setClauses.join(', ')} WHERE id = ? AND user_id = ?`)
    .bind(...values)
    .run()

  if (res.meta.changes === 0) {
    throw new Error('Goal not found or unauthorized')
  }

  const goal = await db.prepare('SELECT * FROM goals WHERE id = ?').bind(goalId).first<Goal>()
  if (!goal) throw new Error('Goal not found')

  return goal
}

export async function deleteGoal(db: D1Database, userId: string, goalId: string): Promise<boolean> {
  const res = await db
    .prepare('DELETE FROM goals WHERE id = ? AND user_id = ?')
    .bind(goalId, userId)
    .run()

  return res.meta.changes > 0
}
