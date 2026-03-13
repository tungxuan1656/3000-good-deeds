import { t } from '@/lib/i18n'
import type { GoalTypeDTO } from '@/types/api'

export const GOAL_TYPES = ['weekly', 'monthly', 'yearly'] as const

export const GOAL_LABELS: Record<GoalTypeDTO, string> = {
  weekly: t('constants.goals.weekly'),
  monthly: t('constants.goals.monthly'),
  yearly: t('constants.goals.yearly'),
}
