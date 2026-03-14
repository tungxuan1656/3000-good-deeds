import { Hono } from 'hono'

import { getUser, updateUser } from '../handlers/users'
import { authMiddleware } from '../middlewares/auth'
import type { UpdateUserRequest } from '../types'
import { ErrorCodes, errorResponse, parseJsonBody, successResponse } from '../utils'

const users = new Hono<{ Bindings: Env; Variables: { user: any } }>()

// Public: Sync user (Removed - using Auth route)

// Protected routes
users.use('/*', authMiddleware)

users.get('/me', async (c) => {
  const currentUser = c.get('user')
  const user = await getUser(c.env.DB, currentUser.id)

  return c.json(successResponse(user))
})

users.patch('/me', async (c) => {
  const currentUser = c.get('user')
  const body = await parseJsonBody<UpdateUserRequest>(c.req.raw)
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Dữ liệu yêu cầu không hợp lệ'), 400)
  }

  try {
    const user = await updateUser(c.env.DB, currentUser.id, body)

    return c.json(successResponse(user))
  } catch (e) {
    if (e instanceof Error) {
      return c.json(errorResponse(ErrorCodes.BAD_REQUEST, e.message), 400)
    }

    return c.json(errorResponse(ErrorCodes.INTERNAL_ERROR, 'Không thể cập nhật người dùng'), 500)
  }
})

export default users
