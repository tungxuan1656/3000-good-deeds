import { BookOpenIcon } from 'lucide-react'
import * as React from 'react'

import { InnerJournalHistoryItem } from '@/components/inner'
import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  DailyQuoteCard,
  EmptyDataView,
  HandbookReflectionFormCard,
  InfoButton,
  KindnessSuggestionCard,
  MiniCheckInCard,
  PageHeader,
  SkeletonList,
  WeeklyRhythmCard,
} from '@/components/shared'
import { Card } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { useInnerJournalEntries } from '@/hooks/api/use-inner-journal'
import { INFO_COPY } from '@/lib/constants/info-copy'
import { t } from '@/lib/i18n'

const HandbookPage = () => {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInnerJournalEntries({
      limit: 10,
    })

  const entries = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data?.data ?? []) ?? []
  }, [data])

  const showLoading = isLoading && entries.length === 0
  const isEmpty = !showLoading && entries.length === 0

  return (
    <MainContainer>
      <MainColumn>
        <PageHeader
          action={
            <InfoButton
              description={INFO_COPY.journal.description}
              title={INFO_COPY.journal.title}
            />
          }
          description={t('pages.handbook.header.description')}
          title={t('pages.handbook.header.title')}
        />

        <HandbookReflectionFormCard />

        <Card className='gap-4'>
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
        </Card>
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
