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
  let body: ProviderExchangeRequest
  try {
    body = await c.req.json()
  } catch {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Provider và idToken là bắt buộc'), 400)
  }
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
      const errorMessage = e.status === 500 ? 'Không thể xử lý yêu cầu đăng nhập' : e.message

      return c.json(errorResponse(errorCode, errorMessage), e.status)
    }

    return c.json(errorResponse(ErrorCodes.INTERNAL_ERROR, 'Đăng nhập thất bại'), 500)
  }
})

auth.post('/refresh', async (c) => {
  let refreshToken: string | undefined
  try {
    const body = await c.req.json<RefreshTokenRequest>()
    refreshToken = body?.refreshToken
  } catch {
    // refreshToken stays undefined
  }

  if (!refreshToken) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Refresh token là bắt buộc'), 400)
  }

  try {
    const result = await refreshAccessToken(c.env.DB, c.env, refreshToken)

    return c.json(successResponse(result))
  } catch (e: any) {
    if (e instanceof AuthHandlerError) {
      const errorCode =
        e.status === 400
          ? ErrorCodes.BAD_REQUEST
          : e.status === 401
            ? ErrorCodes.UNAUTHORIZED
            : ErrorCodes.INTERNAL_ERROR
      const errorMessage =
        e.status === 500 ? 'Không thể xử lý yêu cầu làm mới phiên đăng nhập' : e.message

      return c.json(errorResponse(errorCode, errorMessage), e.status)
    }

    console.error('Refresh error', e)

    return c.json(
      errorResponse(ErrorCodes.INTERNAL_ERROR, 'Không thể xử lý yêu cầu làm mới phiên đăng nhập'),
      500,
    )
  }
})

auth.post('/logout', async (c) => {
  let refreshToken: string | undefined
  try {
    const body = await c.req.json<LogoutRequest>()
    refreshToken = body?.refreshToken
  } catch {
    // logout is OK with no body
  }

  if (refreshToken) {
    await logout(c.env.DB, refreshToken)
  }

  return c.json(successResponse(true))
})

export default auth
