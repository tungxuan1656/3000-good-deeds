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
  const fromParam = c.req.query('from')
  const toParam = c.req.query('to')
  const now = Date.now()
  const from = fromParam ? parseInt(fromParam) : now - 6 * 24 * 60 * 60 * 1000
  const to = toParam ? parseInt(toParam) : now
  const rhythm = await getWeeklyRhythm(c.env.DB, currentUser.id, from, to, timeZone)

  return c.json(successResponse(rhythm))
})

export default activities
