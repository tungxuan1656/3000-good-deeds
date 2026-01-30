import { Hono } from 'hono'

import { getUser, syncUser, updateUser } from '../handlers/users'
import { authMiddleware } from '../middlewares/auth'
import type { SyncUserRequest, UpdateUserRequest } from '../types'
import { ErrorCodes, errorResponse, successResponse } from '../utils'

const users = new Hono<{ Bindings: Env; Variables: { user: any } }>()

// Public: Sync user
users.post('/sync', async (c) => {
  const body = await c.req.json<SyncUserRequest>()
  if (!body || !body.firebaseUid || !body.email) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Thiếu thông tin bắt buộc'), 400)
  }

  const user = await syncUser(c.env.DB, body)

  return c.json(successResponse(user))
})

// Protected routes
users.use('/*', authMiddleware)

users.get('/me', async (c) => {
  const currentUser = c.get('user')
  const user = await getUser(c.env.DB, currentUser.id)

  return c.json(successResponse(user))
})

users.patch('/me', async (c) => {
  const currentUser = c.get('user')
  const body = await c.req.json<UpdateUserRequest>()
  if (!body) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Body request không hợp lệ'), 400)
  }

  const user = await updateUser(c.env.DB, currentUser.id, body)

  return c.json(successResponse(user))
})

export default users
