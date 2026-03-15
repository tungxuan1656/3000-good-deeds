import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getRandomAct, getRandomQuote } from '../handlers/cultivation'
import cultivation from './cultivation'

vi.mock('../handlers/cultivation', async () => {
  const actual = (await vi.importActual('../handlers/cultivation')) as Record<string, unknown>

  return {
    ...actual,
    getRandomAct: vi.fn(),
    getRandomActs: vi.fn(),
    getRandomQuote: vi.fn(),
  }
})

vi.mock('../middlewares/auth', () => ({
  authMiddleware: async (_c: unknown, next: () => Promise<void>) => {
    await next()
  },
}))

const mockedGetRandomQuote = vi.mocked(getRandomQuote)
const mockedGetRandomAct = vi.mocked(getRandomAct)

describe('cultivation routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 404 with error envelope when quote is missing', async () => {
    mockedGetRandomQuote.mockResolvedValueOnce(null)

    const response = await cultivation.request('/quotes/random', { method: 'GET' }, {
      DB: {} as D1Database,
    } as Env)
    const payload = (await response.json()) as any

    expect(response.status).toBe(404)
    expect(payload.success).toBe(false)
    expect(payload.data).toBeNull()
    expect(payload.error.code).toBe('NOT_FOUND')
  })

  it('returns 400 when random-list limit is invalid', async () => {
    const response = await cultivation.request('/acts/random-list?limit=abc', { method: 'GET' }, {
      DB: {} as D1Database,
    } as Env)
    const payload = (await response.json()) as any

    expect(response.status).toBe(400)
    expect(payload.success).toBe(false)
    expect(payload.error.code).toBe('BAD_REQUEST')
  })

  it('returns random act payload without category field', async () => {
    mockedGetRandomAct.mockResolvedValueOnce({
      id: 'act_1',
      name: 'Giúp người qua đường',
      detail: 'Hỗ trợ người cần giúp đỡ',
      note: 'Việc thiện nhỏ',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    const response = await cultivation.request('/acts/random', { method: 'GET' }, {
      DB: {} as D1Database,
    } as Env)
    const payload = (await response.json()) as any

    expect(response.status).toBe(200)
    expect(payload.success).toBe(true)
    expect(payload.data).not.toHaveProperty('category')
  })
})
