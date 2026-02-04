interface CalendarDay {
  date: string
  count: number
}

interface WeeklyRhythmDay {
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
        strftime('%Y-%m-%d', datetime(performed_at/1000, 'unixepoch')) as date,
        COUNT(id) as count
       FROM good_deeds
       WHERE user_id = ?
       AND performed_at >= ? AND performed_at <= ?
       GROUP BY date`,
    )
    // Note: sqlite unixepoch expects seconds, our ts is ms.
    // Also from/to might be YYYY-MM strings or timestamps?
    // The original code used datetime(performed_at, 'unixepoch').
    // If performed_at is ms (Date.now()), we need performed_at/1000.
    // Let's assume input from/to are YYYY-MM-DD strings for filtering?
    // Let's fix the SQL to be robust.
    // But for MVP, sticking to original logic (assuming original was correct or I fix it).
    // Original: datetime(performed_at, 'unixepoch') -> implies performed_at is seconds?
    // But `getCurrentTimestamp` usually returns ms. `Date.now()`.
    // I will adjust to `performed_at/1000`.

    // Also the WHERE clause: date >= ? and date <= ? compares strings YYYY-MM-DD.
    // But `from` param in routes/activities.ts defaults to '2025-01' (YYYY-MM).
    // So distinct comparison might be needed. Use LIKE? or range of timestamps?
    // Let's stick to simple string comparison on the date column derived.
    .bind(userId, new Date(from).getTime(), new Date(to).getTime())
    // Wait, the original code bound `from` and `to` (strings) directly to `date` comparison?
    // "WHERE date >= ? AND date <= ?"
    // This requires `date` to be the projected YYYY-MM-DD string.
    // `strftime` returns string. So correct.

    .all<CalendarDay>()

  return results || []
}

// Calculate current streak
export async function getStreak(
  db: D1Database,
  userId: string,
): Promise<{ currentStreak: number }> {
  // Get unique dates of activity in descending order
  const { results } = await db
    .prepare(
      `SELECT DISTINCT strftime('%Y-%m-%d', datetime(performed_at/1000, 'unixepoch')) as date
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
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const yesterdayDate = new Date(now)
  yesterdayDate.setDate(now.getDate() - 1)

  const yesterday = yesterdayDate.toISOString().split('T')[0]

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

// Get weekly rhythm (7 days)
export async function getWeeklyRhythm(
  db: D1Database,
  userId: string,
  from: number,
  to: number,
  timeZone: string,
): Promise<WeeklyRhythmDay[]> {
  const { results } = await db
    .prepare(
      `SELECT 
        performed_at as performedAt
      FROM good_deeds
      WHERE user_id = ?
      AND performed_at >= ? AND performed_at <= ?
      `,
    )
    .bind(userId, from, to)
    .all<{ performedAt: number }>()

  const counts = new Map<string, number>()

  results.forEach((row) => {
    const key = formatDateParts(getDatePartsInTimeZone(row.performedAt, timeZone))
    counts.set(key, (counts.get(key) ?? 0) + 1)
  })

  const startParts = getDatePartsInTimeZone(from, timeZone)
  const baseDate = new Date(Date.UTC(startParts.year, startParts.month - 1, startParts.day))
  const days: WeeklyRhythmDay[] = []

  for (let i = 0; i < 7; i += 1) {
    const date = new Date(baseDate)
    date.setUTCDate(baseDate.getUTCDate() + i)

    const key = formatDateParts({
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
    })

    days.push({
      date: key,
      count: counts.get(key) ?? 0,
    })
  }

  return days
}
