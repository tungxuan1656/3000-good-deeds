import type { User, UserStats } from '../types'
import { getStreak } from './activities'

export async function getStatsSummary(db: D1Database, user: User): Promise<UserStats> {
  // 1. Total Deeds
  const totalResult = await db
    .prepare('SELECT COUNT(*) as count FROM good_deeds WHERE user_id = ?')
    .bind(user.id)
    .first<{ count: number }>()
  const totalDeeds = totalResult?.count || 0

  // 2. Streak
  const streak = await getStreak(db, user)

  return {
    totalDeeds,
    streakDays: streak.currentStreak,
  }
}
