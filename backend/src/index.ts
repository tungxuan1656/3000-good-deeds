import { Hono } from 'hono'
import { cors } from 'hono/cors'

import activities from './routes/activities'
import categories from './routes/categories'
import deeds from './routes/deeds'
import goals from './routes/goals'
import users from './routes/users'
import { ErrorCodes, errorResponse } from './utils'

const app = new Hono<{ Bindings: Env }>()

// Middleware
app.use('/*', cors())

// Routes
app.route('/users', users)
app.route('/deeds', deeds)
app.route('/categories', categories)
app.route('/goals', goals)
app.route('/activities', activities)

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

