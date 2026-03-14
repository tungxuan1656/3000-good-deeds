import { describe, expect, it, vi } from 'vitest'

import { getStreak } from './activities'
import { getStatsSummary } from './stats'

vi.mock('./activities', () => {
  return {
    getStreak: vi.fn(),
  }
})

const mockedGetStreak = vi.mocked(getStreak)

describe('getStatsSummary', () => {
  it('returns total deeds and streak days from activities handler', async () => {
    const first = vi.fn().mockResolvedValue({ count: 12 })
    const bind = vi.fn().mockReturnValue({ first })
    const prepare = vi.fn().mockReturnValue({ bind })
    const db = { prepare } as unknown as D1Database
    const user = { id: 'user_1' } as any

    mockedGetStreak.mockResolvedValueOnce({ currentStreak: 7 })

    const result = await getStatsSummary(db, user)

    expect(result).toEqual({
      totalDeeds: 12,
      streakDays: 7,
    })
  })
})
