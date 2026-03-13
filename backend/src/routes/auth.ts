import { Hono } from 'hono'

import { loginWithGoogle, logout, refreshAccessToken } from '../handlers/auth'
import type { GoogleAuthRequest, RefreshTokenRequest } from '../types'
import { ErrorCodes, errorResponse, successResponse } from '../utils'

const auth = new Hono<{ Bindings: Env }>()

auth.post('/google', async (c) => {
  const body = await c.req.json<GoogleAuthRequest>()
  if (!body.code) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Mã xác thực là bắt buộc'), 400)
  }

  try {
    const result = await loginWithGoogle(c.env.DB, c.env, body)

    return c.json(successResponse(result))
  } catch (e: any) {
    console.error('Login error', e)

    return c.json(errorResponse(ErrorCodes.INTERNAL_ERROR, e.message || 'Đăng nhập thất bại'), 500)
  }
})

auth.post('/refresh', async (c) => {
  const body = await c.req.json<RefreshTokenRequest>().catch(() => ({}) as RefreshTokenRequest)
  const refreshToken = body.refreshToken

  if (!refreshToken) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Refresh token là bắt buộc'), 400)
  }

  try {
    const result = await refreshAccessToken(c.env.DB, c.env, refreshToken)

    return c.json(successResponse(result))
  } catch (e: any) {
    return c.json(
      errorResponse(ErrorCodes.UNAUTHORIZED, e.message || 'Refresh token không hợp lệ'),
      401,
    )
  }
})

auth.post('/logout', async (c) => {
  const body = await c.req.json<RefreshTokenRequest>().catch(() => ({}) as RefreshTokenRequest)
  const refreshToken = body.refreshToken

  if (refreshToken) {
    await logout(c.env.DB, refreshToken)
  }

  return c.json(successResponse(true))
})

export default auth
