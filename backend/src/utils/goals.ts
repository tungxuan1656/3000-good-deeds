import { type DeedPeriods, type GoalType } from '../types'
import { computeLocalPeriods } from './datetime'

export const getCurrentPeriod = (type: GoalType, timezone: string, timestamp?: number) => {
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
    default:
      return deedPeriods.localWeek
  }
}
