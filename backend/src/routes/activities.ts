import { Hono } from 'hono'

import { getCalendar, getStreak, getWeeklyRhythm } from '../handlers/activities'
import { authMiddleware } from '../middlewares/auth'
import { successResponse } from '../utils'

const activities = new Hono<{ Bindings: Env; Variables: { user: any } }>()

activities.use('/*', authMiddleware)

activities.get('/calendar', async (c) => {
  const currentUser = c.get('user')
  const from = c.req.query('from') || '2025-01'
  const to = c.req.query('to') || '2025-12'
  const calendar = await getCalendar(c.env.DB, currentUser.id, from, to)

  return c.json(successResponse(calendar))
})

activities.get('/streak', async (c) => {
  const currentUser = c.get('user')
  const streak = await getStreak(c.env.DB, currentUser.id)

  return c.json(successResponse(streak))
})

activities.get('/weekly-rhythm', async (c) => {
  const currentUser = c.get('user')
  const userRow = await c.env.DB.prepare('SELECT timezone FROM users WHERE id = ?')
    .bind(currentUser.id)
    .first<{ timezone?: string }>()
  const timeZone = userRow?.timezone || 'Asia/Ho_Chi_Minh'
  const now = new Date()
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)

  const day = today.getDay() // 0: Sun, 1: Mon...
  const diffToMonday = day === 0 ? -6 : 1 - day
  const start = new Date(today)
  start.setDate(today.getDate() + diffToMonday)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  const fromParam = c.req.query('from')
  const toParam = c.req.query('to')
  const from = fromParam ? parseInt(fromParam) : start.getTime()
  const to = toParam ? parseInt(toParam) : end.getTime()

  const rhythm = await getWeeklyRhythm(c.env.DB, currentUser.id, from, to, timeZone)

  return c.json(successResponse(rhythm))
})

export default activities
