import { describe, expect, it, vi } from 'vitest'

import { upsertGoals } from './goals'

describe('upsertGoals transaction safety', () => {
  it('rolls back transaction when one goal is invalid', async () => {
    const exec = vi.fn().mockResolvedValue({})
    const db = { exec } as unknown as D1Database
    const user = {
      id: 'user_1',
      timezone: 'Asia/Ho_Chi_Minh',
    } as any

    await expect(
      upsertGoals(db, user, [{ type: 'invalid', targetCount: 3, isEnabled: true }]),
    ).rejects.toThrow('Thông tin mục tiêu không hợp lệ')

    expect(exec).toHaveBeenCalledTimes(2)
    expect(exec).toHaveBeenNthCalledWith(1, 'BEGIN')
    expect(exec).toHaveBeenNthCalledWith(2, 'ROLLBACK')
  })
})
