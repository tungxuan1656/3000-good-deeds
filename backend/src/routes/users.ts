import { Hono } from 'hono'

import { deleteUserAccount, getUser, updateUser, UserHandlerError } from '../handlers/users'
import { authMiddleware } from '../middlewares/auth'
import type { UpdateUserRequest } from '../types'
import { ErrorCodes, errorResponse, successResponse } from '../utils'

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
  let body: UpdateUserRequest
  try {
    body = await c.req.json()
  } catch {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Dữ liệu yêu cầu không hợp lệ'), 400)
  }
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

users.delete('/me', async (c) => {
  const currentUser = c.get('user')

  try {
    const deleted = await deleteUserAccount(c.env.DB, currentUser.id)

    return c.json(successResponse(deleted))
  } catch (e) {
    if (e instanceof UserHandlerError) {
      const errorCode =
        e.status === 400
          ? ErrorCodes.BAD_REQUEST
          : e.status === 404
            ? ErrorCodes.NOT_FOUND
            : ErrorCodes.INTERNAL_ERROR
      const errorMessage = e.status === 500 ? 'Không thể xóa tài khoản người dùng' : e.message

      return c.json(errorResponse(errorCode, errorMessage), e.status)
    }

    console.error('Delete user account error', e)

    return c.json(
      errorResponse(ErrorCodes.INTERNAL_ERROR, 'Không thể xóa tài khoản người dùng'),
      500,
    )
  }
})

export default users
