import { BookOpenIcon, Loader2Icon } from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'

import { InnerJournalHistoryItem } from '@/components/inner'
import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  CardSection,
  DailyQuoteCard,
  EmptyDataView,
  HeaderSection,
  InfoButton,
  KindnessSuggestionCard,
  MiniCheckInCard,
  SkeletonList,
  WeeklyRhythmCard,
} from '@/components/shared'
import { Button } from '@/components/ui/button'
import { TagButton } from '@/components/ui/tag'
import { Textarea } from '@/components/ui/textarea'
import { useCreateInnerJournalEntry, useInnerJournalEntries } from '@/hooks/api/use-inner-journal'
import { INNER_JOURNAL_TYPES, type InnerJournalType } from '@/lib/constants'
import { INFO_COPY } from '@/lib/constants/info-copy'
import { innerJournalSchema } from '@/lib/forms/form-schemas'
import { t } from '@/lib/i18n'

const HandbookPage = () => {
  const [type, setType] = React.useState<InnerJournalType>('gratitude')
  const [content, setContent] = React.useState('')
  const [errorText, setErrorText] = React.useState<string | null>(null)

  const createMutation = useCreateInnerJournalEntry()
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInnerJournalEntries({
      limit: 10,
    })

  const entries = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data?.data ?? []) ?? []
  }, [data])

  const showLoading = isLoading && entries.length === 0
  const isEmpty = !showLoading && entries.length === 0

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
    } catch {
      toast.error(t('common.errors.saveFailed'))
    }
  }

  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          action={
            <InfoButton
              description={INFO_COPY.journal.description}
              title={INFO_COPY.journal.title}
            />
          }
          description={t('pages.handbook.header.description')}
          title={t('pages.handbook.header.title')}
        />

        <form onSubmit={(event) => void handleSubmit(event)}>
          <CardSection className='gap-4'>
            <div className='flex flex-wrap gap-2'>
              {INNER_JOURNAL_TYPES.map((key) => {
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
              {t(`journal.types.${type}.guidance`)}
            </p>

            <div className='flex flex-col gap-2'>
              <Textarea
                className='bg-card min-h-44 w-full resize-none px-4 py-3 text-sm leading-relaxed'
                placeholder={t('journal.page.placeholder')}
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
              <p className='text-muted-foreground text-sm leading-relaxed'>
                {t('journal.page.immutableNote')}
              </p>
              {errorText && <p className='text-destructive text-xs'>{errorText}</p>}
            </div>

            <Button className='self-end' disabled={createMutation.isPending} type='submit'>
              {createMutation.isPending ? (
                <>
                  <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
                  {t('common.actions.saving')}
                </>
              ) : (
                t('common.actions.save')
              )}
            </Button>
          </CardSection>
        </form>

        <CardSection className='gap-4'>
          <div className='flex items-center justify-between gap-2'>
            <p className='font-headline text-foreground text-xl'>
              {t('pages.handbook.historyTitle')}
            </p>
          </div>

          {showLoading && <SkeletonList />}
          {isEmpty && (
            <EmptyDataView
              Icon={<BookOpenIcon />}
              description={t('pages.handbook.historyEmptyDescription')}
              title={t('pages.handbook.historyEmptyTitle')}
            />
          )}

          {!showLoading && !isEmpty && (
            <div className='flex flex-col gap-3'>
              {entries.map((entry) => (
                <InnerJournalHistoryItem key={entry.id} entry={entry} />
              ))}

              {hasNextPage && (
                <div className='flex justify-center py-2'>
                  <Button
                    disabled={isFetchingNextPage}
                    variant='outline'
                    onClick={() => void fetchNextPage()}>
                    {isFetchingNextPage
                      ? t('pages.innerJournalHistory.loadingMore')
                      : t('pages.innerJournalHistory.loadMore')}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardSection>
      </MainColumn>

      <SideColumn hideInMobile>
        <DailyQuoteCard />
        <KindnessSuggestionCard />
        <MiniCheckInCard />
        <WeeklyRhythmCard />
      </SideColumn>
    </MainContainer>
  )
}

export default HandbookPage
