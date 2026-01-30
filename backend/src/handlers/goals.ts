import type { Goal } from '../types'
import { getCurrentTimestamp } from '../utils'

export async function getGoals(db: D1Database, userId: number): Promise<Goal[]> {
  const { results } = await db
    .prepare(
      `SELECT * FROM goals
       WHERE user_id = ? AND status = 'active'
       ORDER BY created_at DESC`,
    )
    .bind(userId)
    .all<Goal>()

  return results
}

export async function createGoal(
  db: D1Database,
  userId: number,
  type: string,
  targetCount: number,
): Promise<Goal> {
  const now = getCurrentTimestamp()
  const result = await db
    .prepare(
      `INSERT INTO goals (user_id, type, target_count, start_date, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'active', ?, ?)`,
    )
    .bind(userId, type, targetCount, now, now, now)
    .run()

  const id = result.meta.last_row_id as number

  return await getGoalById(db, id)
}

export async function getGoalById(db: D1Database, goalId: number): Promise<Goal> {
  const goal = await db.prepare('SELECT * FROM goals WHERE id = ?').bind(goalId).first<Goal>()

  if (!goal) {
    throw new Error('Goal not found')
  }

  return goal
}
