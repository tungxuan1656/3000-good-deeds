import { Hono } from 'hono'
import { describe, expect, it } from 'vitest'

import { authMiddleware } from './auth'

describe('authMiddleware', () => {
  it('returns 401 when Authorization header is missing', async () => {
    const app = new Hono<{ Bindings: { JWT_SECRET: string; DB: D1Database } }>()
    app.use('*', authMiddleware)
    app.get('/protected', (c) => c.json({ ok: true }))

    const response = await app.request(
      '/protected',
      { method: 'GET' },
      { JWT_SECRET: 'secret', DB: {} as D1Database },
    )
    const payload = (await response.json()) as any

    expect(response.status).toBe(401)
    expect(payload.success).toBe(false)
    expect(payload.error.code).toBe('UNAUTHORIZED')
  })
})
