import type { Context, Next } from 'hono'
import { jwtVerify } from 'jose'

import { getUser } from '../handlers/users'
import { errorResponse } from '../utils'

const JWT_SECRET = 'your-secret-key-change-me' // Fallback if env missing

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json(errorResponse('UNAUTHORIZED', 'Chưa cung cấp token'), 401)
  }

  const token = authHeader.split(' ')[1]
  const secret = new TextEncoder().encode(c.env.JWT_SECRET || JWT_SECRET)

  try {
    const { payload } = await jwtVerify(token, secret)
    const userId = payload.sub as string // We put userId in 'sub'

    if (!userId) {
      return c.json(errorResponse('UNAUTHORIZED', 'Token không hợp lệ'), 401)
    }

    // Verify user exists
    try {
      const user = await getUser(c.env.DB, userId)
      c.set('user', user)
    } catch (e) {
      console.error('User not found', e)

      return c.json(errorResponse('UNAUTHORIZED', 'Không tìm thấy người dùng'), 401)
    }

    await next()
  } catch (e) {
    console.error('Invalid or expired token', e)

    return c.json(errorResponse('UNAUTHORIZED', 'Token không hợp lệ hoặc đã hết hạn'), 401)
  }
}
