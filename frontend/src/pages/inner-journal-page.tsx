import { Loader2Icon } from 'lucide-react'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  CardSection,
  DailyQuoteCard,
  HeaderSection,
  InfoButton,
  MiniCheckInCard,
  WeeklyRhythmCard,
} from '@/components/shared'
import { TourGuideButton } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { TagButton } from '@/components/ui/tag'
import { Textarea } from '@/components/ui/textarea'
import { useCreateInnerJournalEntry } from '@/hooks/api/use-inner-journal'
import { type InnerJournalType, ONBOARDING_CONTENT, ONBOARDING_KEYS, PATHS } from '@/lib/constants'
import { INFO_COPY } from '@/lib/constants/info-copy'
import { innerJournalSchema } from '@/lib/forms/form-schemas'
import { t } from '@/lib/i18n'

const JOURNAL_TYPES: InnerJournalType[] = ['gratitude', 'repentance']

const InnerJournalPage = () => {
  const [type, setType] = React.useState<InnerJournalType>('gratitude')
  const [content, setContent] = React.useState('')
  const [errorText, setErrorText] = React.useState<string | null>(null)

  const createMutation = useCreateInnerJournalEntry()

  const isSaving = createMutation.isPending

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setErrorText(null)

    const parsed = innerJournalSchema.safeParse({ type, content })
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? t('common.errors.invalidContent')
      setErrorText(message)

      return
    }

    try {
      const result = await createMutation.mutateAsync({
        type: parsed.data.type,
        content: parsed.data.content,
      })

      if (!result.success) {
        const message =
          (result as any).error?.message ??
          (result.error ? String(result.error) : t('common.errors.saveFailed'))
        toast.error(message)

        return
      }

      setContent('')
      toast.success(t('common.success.saved'))
    } catch (_e) {
      toast.error(t('common.errors.saveFailed'))
    }
  }

  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          action={
            <div className='flex items-center gap-1'>
              <InfoButton
                description={INFO_COPY.journal.description}
                title={INFO_COPY.journal.title}
              />
              <TourGuideButton
                autoOpen
                flowTitle={ONBOARDING_CONTENT.journal.title}
                steps={ONBOARDING_CONTENT.journal.steps}
                storageKey={ONBOARDING_KEYS.journal}
              />
            </div>
          }
          description={t('journal.page.description')}
          subtitle={t('journal.page.subtitle')}
          title={t('journal.page.title')}
        />

        <form onSubmit={(event) => void handleSubmit(event)}>
          <CardSection className='gap-4'>
            <div className='flex flex-wrap gap-2'>
              {JOURNAL_TYPES.map((key) => {
                const isActive = key === type

                return (
                  <TagButton
                    key={key}
                    isActive={isActive}
                    label={t(`journal.types.${key}.label`)}
                    onToggle={() => setType(key)}
                  />
                )
              })}
            </div>

            <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
              "{t(`journal.types.${type}.guidance`)}"
            </p>

            <div className='flex flex-col gap-2'>
              <Textarea
                className='bg-card min-h-44 w-full resize-none rounded-2xl border border-black/5 px-4 py-3 text-sm leading-relaxed'
                placeholder={t('journal.page.placeholder')}
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
              <p className='text-muted-foreground text-sm leading-relaxed'>
                {t('journal.page.immutableNote')}
              </p>
              {errorText && <p className='text-destructive text-xs'>{errorText}</p>}
            </div>

            <Button disabled={isSaving} type='submit'>
              {isSaving ? (
                <>
                  <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
                  {t('common.actions.saving')}
                </>
              ) : (
                t('common.actions.save')
              )}
            </Button>

            <Button asChild variant='outline'>
              <Link to={PATHS.INNER_JOURNAL_HISTORY}>{t('common.actions.viewHistory')}</Link>
            </Button>
          </CardSection>
        </form>
      </MainColumn>

      <SideColumn hideInMobile>
        <MiniCheckInCard />
        <DailyQuoteCard />
        <WeeklyRhythmCard />
      </SideColumn>
    </MainContainer>
  )
}

export default InnerJournalPage
