import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createDeed, DeedHandlerError, deleteDeed } from '../handlers/deeds'
import deeds from './deeds'

vi.mock('../middlewares/auth', () => {
  return {
    authMiddleware: async (c: any, next: any) => {
      c.set('user', { id: 'user_1', timezone: 'Asia/Ho_Chi_Minh' })
      await next()
    },
  }
})

vi.mock('../handlers/deeds', async () => {
  const actual = (await vi.importActual('../handlers/deeds')) as Record<string, unknown>

  return {
    ...actual,
    createDeed: vi.fn(),
    deleteDeed: vi.fn(),
    getDeeds: vi.fn(),
    updateDeed: vi.fn(),
  }
})

const mockedDeleteDeed = vi.mocked(deleteDeed)
const mockedCreateDeed = vi.mocked(createDeed)

describe('deeds routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 when create body is invalid JSON', async () => {
    const response = await deeds.request(
      '/',
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

  it('returns 404 when deleteDeed reports not found', async () => {
    mockedDeleteDeed.mockRejectedValueOnce(
      new DeedHandlerError('Không tìm thấy việc thiện hoặc không có quyền truy cập', 404),
    )

    const response = await deeds.request('/deed_123', { method: 'DELETE' }, {
      DB: {} as D1Database,
    } as Env)
    const payload = (await response.json()) as any

    expect(response.status).toBe(404)
    expect(payload.success).toBe(false)
    expect(payload.error.code).toBe('NOT_FOUND')
  })

  it('creates deed without category field', async () => {
    mockedCreateDeed.mockResolvedValueOnce({
      id: 'deed_1',
      userId: 'user_1',
      description: 'Giúp người khác',
      labels: 'An vui',
      performedAt: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    const response = await deeds.request(
      '/',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          description: 'Giúp người khác',
          labels: 'An vui',
        }),
      },
      { DB: {} as D1Database } as Env,
    )
    const payload = (await response.json()) as any

    expect(response.status).toBe(201)
    expect(payload.success).toBe(true)
    expect(mockedCreateDeed).toHaveBeenCalledTimes(1)

    expect(mockedCreateDeed).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ id: 'user_1' }),
      expect.objectContaining({
        description: 'Giúp người khác',
        labels: 'An vui',
      }),
    )

    expect(mockedCreateDeed.mock.calls[0][2]).not.toHaveProperty('categoryCode')
  })
})
