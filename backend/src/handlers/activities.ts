import { type CalendarDay, type User } from '../types'
import { formatDateParts, getZonedDateParts } from '../utils'

// Get daily counts for calendar view
export async function getCalendar(
  db: D1Database,
  user: User,
  from: string,
  to: string,
): Promise<CalendarDay[]> {
  const { results } = await db
    .prepare(
      `SELECT 
        local_date as date,
        COUNT(id) as count
       FROM good_deeds
       WHERE user_id = ?
       AND local_date >= ?
       AND local_date <= ?
       GROUP BY date`,
    )
    .bind(user.id, from, to)
    .all<CalendarDay>()

  return results || []
}

// Calculate current streak
export async function getStreak(db: D1Database, user: User): Promise<{ currentStreak: number }> {
  // Get unique dates of activity in descending order
  const { results } = await db
    .prepare(
      `SELECT DISTINCT local_date as date
       FROM good_deeds
       WHERE user_id = ?
       ORDER BY date DESC
       LIMIT 365`,
    )
    .bind(user.id)
    .all<{ date: string }>()

  if (!results || results.length === 0) {
    return { currentStreak: 0 }
  }

  const uniqueDates = results.map((r) => r.date)
  // Use current date as reference (UTC)
  const now = Date.now()
  const today = formatDateParts(getZonedDateParts(user.timezone, now))
  const yesterdayDate = new Date(now)
  yesterdayDate.setDate(yesterdayDate.getDate() - 1)

  const yesterday = formatDateParts(getZonedDateParts(user.timezone, yesterdayDate.getTime()))

  // Check if the most recent activity was today or yesterday
  const lastActivityDate = uniqueDates[0]

  if (lastActivityDate !== today && lastActivityDate !== yesterday) {
    return { currentStreak: 0 }
  }

  let streak = 1
  let currentDate = new Date(lastActivityDate)

  // Iterate through previous dates to check continuity
  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDateStr = uniqueDates[i]
    const prevDate = new Date(prevDateStr)

    // Check difference in days
    const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime())
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      streak++
      currentDate = prevDate
    } else {
      break
    }
  }

  return { currentStreak: streak }
}
