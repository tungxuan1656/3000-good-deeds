interface CalendarDay {
  date: string
  count: number
}

type DateParts = {
  year: number
  month: number
  day: number
}

const getDatePartsInTimeZone = (timestamp: number, timeZone: string): DateParts => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const parts = formatter.formatToParts(new Date(timestamp))
  const year = Number(parts.find((part) => part.type === 'year')?.value)
  const month = Number(parts.find((part) => part.type === 'month')?.value)
  const day = Number(parts.find((part) => part.type === 'day')?.value)

  return { year, month, day }
}

const formatDateParts = (parts: DateParts): string => {
  const month = String(parts.month).padStart(2, '0')
  const day = String(parts.day).padStart(2, '0')

  return `${parts.year}-${month}-${day}`
}

// Get daily counts for calendar view
export async function getCalendar(
  db: D1Database,
  userId: string,
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
    .bind(userId, from, to)
    .all<CalendarDay>()

  return results || []
}

// Calculate current streak
export async function getStreak(
  db: D1Database,
  userId: string,
): Promise<{ currentStreak: number }> {
  // Get user's timezone
  const userRow = await db
    .prepare('SELECT timezone FROM users WHERE id = ?')
    .bind(userId)
    .first<{ timezone?: string }>()
  const timeZone = userRow?.timezone || 'Asia/Ho_Chi_Minh'

  // Get unique dates of activity in descending order
  const { results } = await db
    .prepare(
      `SELECT DISTINCT local_date as date
       FROM good_deeds
       WHERE user_id = ?
       ORDER BY date DESC
       LIMIT 365`,
    )
    .bind(userId)
    .all<{ date: string }>()

  if (!results || results.length === 0) {
    return { currentStreak: 0 }
  }

  const uniqueDates = results.map((r) => r.date)
  // Use current date as reference (UTC)
  const now = Date.now()
  const today = formatDateParts(getDatePartsInTimeZone(now, timeZone))
  const yesterdayDate = new Date(now)
  yesterdayDate.setDate(yesterdayDate.getDate() - 1)

  const yesterday = formatDateParts(getDatePartsInTimeZone(yesterdayDate.getTime(), timeZone))

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
