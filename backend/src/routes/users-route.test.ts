import { beforeEach, describe, expect, it, vi } from 'vitest'

import { deleteUserAccount, UserHandlerError } from '../handlers/users'
import users from './users'

vi.mock('../middlewares/auth', () => {
  return {
    authMiddleware: async (c: any, next: any) => {
      const authHeader = c.req.header('Authorization')

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json(
          {
            success: false,
            data: null,
            error: {
              code: 'UNAUTHORIZED',
              message: 'Chưa cung cấp token',
            },
          },
          401,
        )
      }

      c.set('user', { id: 'user_1', timezone: 'Asia/Ho_Chi_Minh' })
      await next()
    },
  }
})

vi.mock('../handlers/users', async () => {
  const actual = (await vi.importActual('../handlers/users')) as Record<string, unknown>

  return {
    ...actual,
    getUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUserAccount: vi.fn(),
  }
})

const mockedDeleteUserAccount = vi.mocked(deleteUserAccount)

describe('users routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when Authorization header is missing on delete me', async () => {
    const response = await users.request('/me', { method: 'DELETE' }, {
      DB: {} as D1Database,
    } as Env)
    const payload = (await response.json()) as any

    expect(response.status).toBe(401)
    expect(payload.success).toBe(false)
    expect(payload.error.code).toBe('UNAUTHORIZED')
  })

  it('returns 200 when deleting current account succeeds', async () => {
    mockedDeleteUserAccount.mockResolvedValueOnce(true)

    const response = await users.request(
      '/me',
      {
        method: 'DELETE',
        headers: { Authorization: 'Bearer token' },
      },
      { DB: {} as D1Database } as Env,
    )
    const payload = (await response.json()) as any

    expect(response.status).toBe(200)
    expect(payload.success).toBe(true)
    expect(payload.data).toBe(true)
  })

  it('returns 404 when user handler reports account not found', async () => {
    mockedDeleteUserAccount.mockRejectedValueOnce(
      new UserHandlerError('Không tìm thấy người dùng', 404),
    )

    const response = await users.request(
      '/me',
      {
        method: 'DELETE',
        headers: { Authorization: 'Bearer token' },
      },
      { DB: {} as D1Database } as Env,
    )
    const payload = (await response.json()) as any

    expect(response.status).toBe(404)
    expect(payload.success).toBe(false)
    expect(payload.error.code).toBe('NOT_FOUND')
  })
})
