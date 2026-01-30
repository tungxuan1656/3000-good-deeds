import { Hono } from 'hono'
import { cors } from 'hono/cors'

import achievements from './routes/achievements'
import activities from './routes/activities'
import auth from './routes/auth'
import categories from './routes/categories'
import deeds from './routes/deeds'
import goals from './routes/goals'
import reminders from './routes/reminders'
import stats from './routes/stats'
import users from './routes/users'
import { ErrorCodes, errorResponse } from './utils'

const app = new Hono<{ Bindings: Env }>()

// Middleware
app.use('/*', cors())

// Routes
app.route('/api/v1/users', users)
app.route('/api/v1/deeds', deeds)
app.route('/api/v1/categories', categories)
app.route('/api/v1/goals', goals)
app.route('/api/v1/activities', activities)
app.route('/api/v1/achievements', achievements)
app.route('/api/v1/stats', stats)
app.route('/api/v1/reminders', reminders)
app.route('/api/v1/auth', auth)

import { seed } from './seed'

app.post('/api/v1/seed', async (c) => {
  await seed(c.env.DB)

  return c.json({ success: true, message: 'Seeded' })
})

// 404 Handler
app.notFound((c) => {
  return c.json(errorResponse(ErrorCodes.NOT_FOUND, 'Không tìm thấy đường dẫn'), 404)
})

// Error Handler
app.onError((err, c) => {
  console.error('Error:', err)

  return c.json(
    errorResponse(
      ErrorCodes.INTERNAL_ERROR,
      err instanceof Error ? err.message : 'Lỗi máy chủ nội bộ',
    ),
    500,
  )
})

export default app
