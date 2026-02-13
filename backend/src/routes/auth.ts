import { Hono } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'

import { loginWithGoogle, logout, refreshAccessToken, restoreSession } from '../handlers/auth'
import type { GoogleAuthRequest, RefreshTokenRequest } from '../types'
import { ErrorCodes, errorResponse, successResponse } from '../utils'

const auth = new Hono<{ Bindings: Env }>()
const REFRESH_COOKIE_NAME = 'gd_refresh_token'
const REFRESH_COOKIE_MAX_AGE_SECONDS = 90 * 24 * 60 * 60

function isMobileClient(clientTypeHeader?: string) {
  const clientType = clientTypeHeader?.toLowerCase()

  return clientType === 'mobile'
}

function getCookieOptions(requestUrl: string) {
  const isSecure = requestUrl.startsWith('https://')

  return {
    httpOnly: true,
    secure: isSecure,
    path: '/api/v1/auth',
    sameSite: isSecure ? ('None' as const) : ('Lax' as const),
    maxAge: REFRESH_COOKIE_MAX_AGE_SECONDS,
  }
}

auth.post('/google', async (c) => {
  const body = await c.req.json<GoogleAuthRequest>()
  if (!body.code) {
    return c.json(errorResponse(ErrorCodes.BAD_REQUEST, 'Mã xác thực là bắt buộc'), 400)
  }

  try {
    const result = await loginWithGoogle(c.env.DB, c.env, body)

    if (isMobileClient(c.req.header('X-Client-Type'))) {
      return c.json(successResponse(result))
    }

    if (result.refreshToken) {
      setCookie(c, REFRESH_COOKIE_NAME, result.refreshToken, getCookieOptions(c.req.url))
    }

    // Do not expose refresh token to the frontend JS when cookie auth is enabled
    const { refreshToken: _refreshToken, ...safeResult } = result

    return c.json(successResponse(safeResult))
  } catch (e: any) {
    console.error('Login error', e)

    return c.json(errorResponse(ErrorCodes.INTERNAL_ERROR, e.message || 'Đăng nhập thất bại'), 500)
  }
})

auth.post('/refresh', async (c) => {
  let refreshToken = getCookie(c, REFRESH_COOKIE_NAME)

  if (isMobileClient(c.req.header('X-Client-Type'))) {
    const body = await c.req.json<RefreshTokenRequest>().catch(() => ({}) as RefreshTokenRequest)
    refreshToken = body.refreshToken
  }

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

auth.get('/session', async (c) => {
  const refreshToken = getCookie(c, REFRESH_COOKIE_NAME)

  if (!refreshToken) {
    return c.json(errorResponse(ErrorCodes.UNAUTHORIZED, 'Không có phiên đăng nhập'), 401)
  }

  try {
    const result = await restoreSession(c.env.DB, c.env, refreshToken)

    return c.json(successResponse(result))
  } catch (e: any) {
    deleteCookie(c, REFRESH_COOKIE_NAME, { path: '/api/v1/auth' })

    return c.json(
      errorResponse(ErrorCodes.UNAUTHORIZED, e.message || 'Phiên đăng nhập không hợp lệ'),
      401,
    )
  }
})

auth.post('/logout', async (c) => {
  let refreshToken = getCookie(c, REFRESH_COOKIE_NAME)

  if (isMobileClient(c.req.header('X-Client-Type'))) {
    const body = await c.req.json<RefreshTokenRequest>().catch(() => ({}) as RefreshTokenRequest)
    refreshToken = body.refreshToken
  }

  if (refreshToken) {
    await logout(c.env.DB, refreshToken)
  }

  deleteCookie(c, REFRESH_COOKIE_NAME, { path: '/api/v1/auth' })

  return c.json(successResponse(true))
})

export default auth
