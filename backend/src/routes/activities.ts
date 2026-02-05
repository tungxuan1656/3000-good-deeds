import { Hono } from 'hono'

import { getCalendar, getStreak } from '../handlers/activities'
import { authMiddleware } from '../middlewares/auth'
import { type User } from '../types'
import { successResponse } from '../utils'

const activities = new Hono<{ Bindings: Env; Variables: { user: User } }>()

activities.use('/*', authMiddleware)

activities.get('/calendar', async (c) => {
  const currentUser = c.get('user')
  const from = c.req.query('from') || '2025-01'
  const to = c.req.query('to') || '2025-12'
  const calendar = await getCalendar(c.env.DB, currentUser, from, to)

  return c.json(successResponse(calendar))
})

activities.get('/streak', async (c) => {
  const currentUser = c.get('user')
  const streak = await getStreak(c.env.DB, currentUser)

  return c.json(successResponse(streak))
})

export default activities
