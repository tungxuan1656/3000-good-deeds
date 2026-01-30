import type { UserStats } from '../types'
import { getStreak } from './activities'

export async function getStatsSummary(db: D1Database, userId: string): Promise<UserStats> {
  // 1. Total Deeds
  const totalResult = await db
    .prepare('SELECT COUNT(*) as count FROM good_deeds WHERE user_id = ?')
    .bind(userId)
    .first<{ count: number }>()
  const totalDeeds = totalResult?.count || 0

  // 2. Streak (reuse logic)
  const streak = await getStreak(db, userId)

  // 3. Today Count
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const todayEnd = todayStart + 86400000

  const todayResult = await db
    .prepare(
      'SELECT COUNT(*) as count FROM good_deeds WHERE user_id = ? AND performed_at >= ? AND performed_at < ?',
    )
    .bind(userId, todayStart, todayEnd)
    .first<{ count: number }>()
  const todayCount = todayResult?.count || 0

  return {
    totalDeeds,
    streakDays: streak.currentStreak,
    todayCount,
  }
}
