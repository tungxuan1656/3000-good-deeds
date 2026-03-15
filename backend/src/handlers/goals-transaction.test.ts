import { describe, expect, it, vi } from 'vitest'

import { upsertGoals } from './goals'

describe('upsertGoals validation safety', () => {
  it('rejects invalid goal payload before any database write', async () => {
    const prepare = vi.fn()
    const db = { prepare } as unknown as D1Database
    const user = {
      id: 'user_1',
      timezone: 'Asia/Ho_Chi_Minh',
    } as any

    await expect(
      upsertGoals(db, user, [{ type: 'invalid', targetCount: 3, isEnabled: true }]),
    ).rejects.toThrow('Thông tin mục tiêu không hợp lệ')

    expect(prepare).not.toHaveBeenCalled()
  })
})
