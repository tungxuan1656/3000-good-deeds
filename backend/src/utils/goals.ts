import { type DeedPeriods, type GoalType } from '../types'
import { computeLocalPeriods } from './datetime'

export const MILESTONE_PERIOD = 'milestone_1'

export const getCurrentPeriod = (type: GoalType, timezone: string, timestamp?: number) => {
  if (type === 'milestone') {
    return MILESTONE_PERIOD
  }

  const { localWeek, localMonth, localYear } = computeLocalPeriods(timezone, timestamp)

  switch (type) {
    case 'weekly':
      return localWeek
    case 'monthly':
      return localMonth
    case 'yearly':
      return localYear
    default:
      return localWeek
  }
}

export const getDeedPeriodForGoal = (type: GoalType, deedPeriods: DeedPeriods) => {
  switch (type) {
    case 'weekly':
      return deedPeriods.localWeek
    case 'monthly':
      return deedPeriods.localMonth
    case 'yearly':
      return deedPeriods.localYear
    case 'milestone':
      return MILESTONE_PERIOD
    default:
      return deedPeriods.localWeek
  }
}
