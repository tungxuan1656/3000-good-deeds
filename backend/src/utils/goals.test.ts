import { describe, expect, it } from 'vitest'

import { getCurrentPeriod, getDeedPeriodForGoal } from './goals'

describe('getCurrentPeriod', () => {
  const ts = Date.UTC(2026, 0, 15, 12, 0, 0)

  it('returns weekly period for weekly goals', () => {
    expect(getCurrentPeriod('weekly', 'Asia/Ho_Chi_Minh', ts)).toBe('2026-W03')
  })

  it('returns monthly period for monthly goals', () => {
    expect(getCurrentPeriod('monthly', 'Asia/Ho_Chi_Minh', ts)).toBe('2026-01')
  })

  it('returns yearly period for yearly goals', () => {
    expect(getCurrentPeriod('yearly', 'Asia/Ho_Chi_Minh', ts)).toBe('2026')
  })
})

describe('getDeedPeriodForGoal', () => {
  const deedPeriods = {
    localWeek: '2026-W03',
    localMonth: '2026-01',
    localYear: '2026',
  }

  it('maps weekly goal to localWeek', () => {
    expect(getDeedPeriodForGoal('weekly', deedPeriods)).toBe('2026-W03')
  })

  it('maps monthly goal to localMonth', () => {
    expect(getDeedPeriodForGoal('monthly', deedPeriods)).toBe('2026-01')
  })

  it('maps yearly goal to localYear', () => {
    expect(getDeedPeriodForGoal('yearly', deedPeriods)).toBe('2026')
  })
})
