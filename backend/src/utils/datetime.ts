import { type DateParts } from '../types'

type ZonedDateParts = {
  year: number
  month: number
  day: number
}

type ZonedTimeParts = {
  hour: number
  minute: number
}

export const getZonedDateParts = (timezone: string, timestamp: number): ZonedDateParts => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const parts = formatter.formatToParts(new Date(timestamp))
  const year = Number(parts.find((p) => p.type === 'year')?.value)
  const month = Number(parts.find((p) => p.type === 'month')?.value)
  const day = Number(parts.find((p) => p.type === 'day')?.value)

  return { year, month, day }
}

export const getZonedTimeParts = (timezone: string, timestamp: number): ZonedTimeParts => {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const parts = formatter.formatToParts(new Date(timestamp))
  const hour = Number(parts.find((p) => p.type === 'hour')?.value)
  const minute = Number(parts.find((p) => p.type === 'minute')?.value)

  return { hour, minute }
}

const getIsoWeekInfo = (year: number, month: number, day: number) => {
  const date = new Date(Date.UTC(year, month - 1, day))
  const dayOfWeek = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dayOfWeek)

  const isoYear = date.getUTCFullYear()
  const yearStart = new Date(Date.UTC(isoYear, 0, 1))
  const weekNumber = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)

  return { isoYear, weekNumber }
}

export const computeLocalPeriods = (timezone: string, timestamp?: number) => {
  const resolvedTimestamp = timestamp ?? Date.now()
  const { year, month, day } = getZonedDateParts(timezone, resolvedTimestamp)
  const { isoYear, weekNumber } = getIsoWeekInfo(year, month, day)

  const localMonth = `${year}-${String(month).padStart(2, '0')}`
  const localDate = `${localMonth}-${String(day).padStart(2, '0')}`
  const localYear = `${year}`
  const localWeek = `${isoYear}-W${String(weekNumber).padStart(2, '0')}`

  return {
    localDate,
    localWeek,
    localMonth,
    localYear,
    year,
    month,
    day,
  }
}

export const getLocalDateStringByTimezone = (timezone: string, timestamp?: number) => {
  return computeLocalPeriods(timezone, timestamp).localDate
}

export const getPeriodStartEnd = (
  type: 'weekly' | 'monthly' | 'yearly',
  timezone: string,
  timestamp?: number,
) => {
  const { year, month, day } = computeLocalPeriods(timezone, timestamp)

  if (type === 'monthly') {
    const startDate = Date.UTC(year, month - 1, 1)
    const lastDay = new Date(Date.UTC(year, month, 0))
    const endDate = Date.UTC(
      lastDay.getUTCFullYear(),
      lastDay.getUTCMonth(),
      lastDay.getUTCDate(),
      23,
      59,
      59,
      999,
    )

    return { startDate, endDate }
  }

  if (type === 'yearly') {
    const startDate = Date.UTC(year, 0, 1)
    const endDate = Date.UTC(year, 11, 31, 23, 59, 59, 999)

    return { startDate, endDate }
  }

  const date = new Date(Date.UTC(year, month - 1, day))
  const dayOfWeek = date.getUTCDay() || 7
  const weekStart = new Date(date)
  weekStart.setUTCDate(date.getUTCDate() - dayOfWeek + 1)

  const weekEnd = new Date(weekStart)
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6)

  const startDate = Date.UTC(
    weekStart.getUTCFullYear(),
    weekStart.getUTCMonth(),
    weekStart.getUTCDate(),
  )
  const endDate = Date.UTC(
    weekEnd.getUTCFullYear(),
    weekEnd.getUTCMonth(),
    weekEnd.getUTCDate(),
    23,
    59,
    59,
    999,
  )

  return { startDate, endDate }
}

export const formatDateParts = (parts: DateParts): string => {
  const month = String(parts.month).padStart(2, '0')
  const day = String(parts.day).padStart(2, '0')

  return `${parts.year}-${month}-${day}`
}
