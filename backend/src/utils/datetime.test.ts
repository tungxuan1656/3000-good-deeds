import { describe, expect, it } from 'vitest'

import { computeLocalPeriods, getPeriodStartEnd } from './datetime'

describe('computeLocalPeriods', () => {
  it('computes local date parts in Asia/Ho_Chi_Minh timezone', () => {
    const ts = Date.UTC(2026, 0, 15, 12, 0, 0) // 2026-01-15T12:00:00Z
    const periods = computeLocalPeriods('Asia/Ho_Chi_Minh', ts)

    expect(periods.localDate).toBe('2026-01-15')
    expect(periods.localMonth).toBe('2026-01')
    expect(periods.localYear).toBe('2026')
    expect(periods.localWeek).toBe('2026-W03')
  })
})

describe('getPeriodStartEnd', () => {
  const ts = Date.UTC(2026, 0, 15, 12, 0, 0)

  it('returns monthly period boundaries', () => {
    const result = getPeriodStartEnd('monthly', 'Asia/Ho_Chi_Minh', ts)

    expect(result.startDate).toBe(Date.UTC(2026, 0, 1, 0, 0, 0, 0))
    expect(result.endDate).toBe(Date.UTC(2026, 0, 31, 23, 59, 59, 999))
  })

  it('returns yearly period boundaries', () => {
    const result = getPeriodStartEnd('yearly', 'Asia/Ho_Chi_Minh', ts)

    expect(result.startDate).toBe(Date.UTC(2026, 0, 1, 0, 0, 0, 0))
    expect(result.endDate).toBe(Date.UTC(2026, 11, 31, 23, 59, 59, 999))
  })

  it('returns weekly period boundaries with Monday start and Sunday end', () => {
    const result = getPeriodStartEnd('weekly', 'Asia/Ho_Chi_Minh', ts)

    expect(result.startDate).toBe(Date.UTC(2026, 0, 12, 0, 0, 0, 0))
    expect(result.endDate).toBe(Date.UTC(2026, 0, 18, 23, 59, 59, 999))
  })
})
