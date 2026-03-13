import { t } from '@/lib/i18n'
import type { GoalType } from '@/types/api'

// Language-change in this app triggers a full page reload, so module-level t() calls are safe.
export const GOAL_TYPES = ['weekly', 'monthly', 'yearly'] as const

export const GOAL_LABELS: Record<GoalType, string> = {
  weekly: t('constants.goals.weekly'),
  monthly: t('constants.goals.monthly'),
  yearly: t('constants.goals.yearly'),
}
