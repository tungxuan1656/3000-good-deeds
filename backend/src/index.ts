import { Hono } from 'hono'
import { cors } from 'hono/cors'

import activities from './routes/activities'
import feed from './routes/feed'
import friends from './routes/friends'
import posts from './routes/posts'
import users from './routes/users'
import { ErrorCodes, errorResponse } from './utils'

const app = new Hono<{ Bindings: Env }>()

// Middleware
app.use('/*', cors())

// Routes
app.route('/users', users)
app.route('/posts', posts)
app.route('/feed', feed)
app.route('/activities', activities)
app.route('/friends', friends)

// 404 Handler
app.notFound((c) => {
  return c.json(
    errorResponse(ErrorCodes.NOT_FOUND, 'Không tìm thấy đường dẫn'),
    404,
  )
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
