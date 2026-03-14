import { Hono } from 'hono'

import {
  AuthHandlerError,
  exchangeProviderToken,
  logout,
  refreshAccessToken,
} from '../handlers/auth'
import type { LogoutRequest, ProviderExchangeRequest, RefreshTokenRequest } from '../types'
import { ErrorCodes, errorResponse, successResponse } from '../utils'

const auth = new Hono<{ Bindings: Env }>()

auth.post('/provider/exchange', async (c) => {
  const body = await c.req.json<ProviderExchangeRequest>().catch(() => null)
  if (!body?.provider || !body.idToken) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Provider và idToken là bắt buộc'), 400)
  }

  try {
    const result = await exchangeProviderToken(c.env.DB, c.env, body)

    return c.json(successResponse(result))
  } catch (e: any) {
    console.error('Provider exchange error', e)

    if (e instanceof AuthHandlerError) {
      const errorCode =
        e.status === 400
          ? ErrorCodes.BAD_REQUEST
          : e.status === 401
            ? ErrorCodes.UNAUTHORIZED
            : ErrorCodes.INTERNAL_ERROR

      return c.json(errorResponse(errorCode, e.message), e.status)
    }

    return c.json(errorResponse(ErrorCodes.INTERNAL_ERROR, 'Đăng nhập thất bại'), 500)
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
  const body = await c.req.json<LogoutRequest>().catch(() => ({}) as LogoutRequest)
  const refreshToken = body.refreshToken

  if (refreshToken) {
    await logout(c.env.DB, refreshToken)
  }

  return c.json(successResponse(true))
})

export default auth
