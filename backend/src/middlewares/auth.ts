import type { Context, Next } from 'hono'

import { getAuthContext } from '../auth'
import { errorResponse } from '../utils'

export const authMiddleware = async (c: Context, next: Next) => {
  const authResult = await getAuthContext(c.env.DB, c.req.raw)
  if ('error' in authResult) {
    return c.json(errorResponse(authResult.code, authResult.error), 401)
  }
  c.set('user', authResult.user)
  await next()
}
