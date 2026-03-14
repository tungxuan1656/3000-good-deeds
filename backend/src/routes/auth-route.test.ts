import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthHandlerError, refreshAccessToken } from '../handlers/auth'
import auth from './auth'

vi.mock('../handlers/auth', async () => {
  const actual = (await vi.importActual('../handlers/auth')) as Record<string, unknown>

  return {
    ...actual,
    exchangeProviderToken: vi.fn(),
    logout: vi.fn(),
    refreshAccessToken: vi.fn(),
  }
})

const mockedRefreshAccessToken = vi.mocked(refreshAccessToken)

describe('auth routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 when refresh body is invalid JSON', async () => {
    const response = await auth.request(
      '/refresh',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{',
      },
      { DB: {} as D1Database } as Env,
    )
    const payload = (await response.json()) as any

    expect(response.status).toBe(400)
    expect(payload.success).toBe(false)
    expect(payload.error.code).toBe('BAD_REQUEST')
  })

  it('maps AuthHandlerError 500 to INTERNAL_ERROR without leaking internal details', async () => {
    mockedRefreshAccessToken.mockRejectedValueOnce(
      new AuthHandlerError('Missing JWT_SECRET in environment', 500),
    )

    const response = await auth.request(
      '/refresh',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ refreshToken: 'token' }),
      },
      { DB: {} as D1Database } as Env,
    )
    const payload = (await response.json()) as any

    expect(response.status).toBe(500)
    expect(payload.success).toBe(false)
    expect(payload.error.code).toBe('INTERNAL_ERROR')
    expect(payload.error.message).toBe('Không thể xử lý yêu cầu làm mới phiên đăng nhập')
    expect(payload.error.message).not.toContain('JWT_SECRET')
  })
})
