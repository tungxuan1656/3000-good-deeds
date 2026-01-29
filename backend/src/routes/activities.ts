import { Hono } from 'hono'

import { getCalendar, getStreak } from '../handlers/activities'
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

export default activities
