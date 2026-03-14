import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getRandomQuote } from '../handlers/cultivation'
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

const mockedGetRandomQuote = vi.mocked(getRandomQuote)

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
})
