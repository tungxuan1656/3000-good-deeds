import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { sendReminderNotifications } from './handlers/reminders'
import activities from './routes/activities'
import auth from './routes/auth'
import cultivation from './routes/cultivation'
import deeds from './routes/deeds'
import goals from './routes/goals'
import journal from './routes/journal'
import reminders from './routes/reminders'
import stats from './routes/stats'
import users from './routes/users'
import { ErrorCodes, errorResponse } from './utils'

const app = new Hono<{ Bindings: Env }>()

// Middleware
const allowedOrigins = [
  'https://3000-viec-thien.web.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

app.use(
  '/*',
  cors({
    origin: (origin) => {
      if (!origin) {
        return ''
      }

      return allowedOrigins.includes(origin) ? origin : ''
    },
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Client-Type'],
    credentials: true,
  }),
)

// Health check
app.get('/ping', (c) => {
  return c.json({ ok: true, message: 'pong', timestamp: Date.now() })
})

// Routes
app.route('/api/v1/users', users)
app.route('/api/v1/deeds', deeds)
app.route('/api/v1/goals', goals)
app.route('/api/v1/activities', activities)
app.route('/api/v1/stats', stats)
app.route('/api/v1/reminders', reminders)
app.route('/api/v1/cultivation', cultivation)
app.route('/api/v1/journal', journal)
app.route('/api/v1/auth', auth)

// 404 Handler
app.notFound((c) => {
  return c.json(errorResponse(ErrorCodes.NOT_FOUND, 'Không tìm thấy đường dẫn'), 404)
})

// Error Handler
app.onError((err, c) => {
  console.error('Unhandled error', err)

  return c.json(errorResponse(ErrorCodes.INTERNAL_ERROR, 'Lỗi máy chủ nội bộ'), 500)
})

export default {
  fetch: app.fetch,
  scheduled: async (_event: ScheduledEvent, env: Env, ctx: ExecutionContext) => {
    ctx.waitUntil(sendReminderNotifications(env))
  },
}
