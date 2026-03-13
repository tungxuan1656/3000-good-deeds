import { t } from '@/lib/i18n'

// Language-change in this app triggers a full page reload, so module-level t() calls are safe.
export const MOOD_TAGS = [
  t('constants.moodTags.peaceful'),
  t('constants.moodTags.grateful'),
  t('constants.moodTags.lightHearted'),
  t('constants.moodTags.warm'),
  t('constants.moodTags.calm'),
  t('constants.moodTags.hopeful'),
] as const
