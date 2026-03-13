import { z } from 'zod'

import type { InnerJournalType } from '@/lib/constants'
import { t } from '@/lib/i18n'

// NOTE: Using module-level t() is safe in this project because language change forces a full page reload.
export const innerJournalSchema = z.object({
  type: z.enum(['gratitude', 'repentance'] satisfies [InnerJournalType, ...InnerJournalType[]]),
  content: z.string().trim().min(1, t('journal.validation.emptyContent')),
})
