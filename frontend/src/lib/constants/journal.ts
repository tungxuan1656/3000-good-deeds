import { t } from '@/lib/i18n'

// Language-change in this app triggers a full page reload, so module-level t() calls are safe.
export const INNER_JOURNAL_TYPES = ['gratitude', 'repentance'] as const
export type InnerJournalType = (typeof INNER_JOURNAL_TYPES)[number]

export const INNER_JOURNAL_TYPE_LABELS: Record<InnerJournalType, string> = {
  gratitude: t('constants.innerJournal.types.gratitude'),
  repentance: t('constants.innerJournal.types.repentance'),
}

export const INNER_JOURNAL_TYPE_GUIDANCE: Record<InnerJournalType, string> = {
  repentance: t('journal.types.repentance.guidance'),
  gratitude: t('journal.types.gratitude.guidance'),
}

export const INNER_JOURNAL_IMMUTABLE_NOTE = t(
  'constants.innerJournal.immutableNote',
)
