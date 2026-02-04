import type { UserStats } from '../types'
import { getLocalDateStringByTimeZone } from '../utils/datetime'
import { getStreak } from './activities'

export async function getStatsSummary(db: D1Database, userId: string): Promise<UserStats> {
  // Get user's timezone
  const userRow = await db
    .prepare('SELECT timezone FROM users WHERE id = ?')
    .bind(userId)
    .first<{ timezone?: string }>()
  const timeZone = userRow?.timezone || 'Asia/Ho_Chi_Minh'

  // 1. Total Deeds
  const totalResult = await db
    .prepare('SELECT COUNT(*) as count FROM good_deeds WHERE user_id = ?')
    .bind(userId)
    .first<{ count: number }>()
  const totalDeeds = totalResult?.count || 0

  // 2. Streak (reuse logic)
  const streak = await getStreak(db, userId)

  // 3. Today Count
  const today = getLocalDateStringByTimeZone(timeZone)

  const todayResult = await db
    .prepare(
      `SELECT COUNT(*) as count
       FROM good_deeds
       WHERE user_id = ?
       AND COALESCE(local_date, strftime('%Y-%m-%d', datetime(performed_at/1000, 'unixepoch'))) = ?`,
    )
    .bind(userId, today)
    .first<{ count: number }>()
  const todayCount = todayResult?.count || 0

  return {
    totalDeeds,
    streakDays: streak.currentStreak,
    todayCount,
  }
}
