import { BookOpenIcon } from 'lucide-react'
import * as React from 'react'
import { Link } from 'react-router-dom'

import { InnerJournalHistoryItem } from '@/components/inner/inner-journal-history-item'
import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  DailyQuoteCard,
  HeaderSection,
  MiniCheckInCard,
  WeeklyRhythmCard,
} from '@/components/shared'
import { EmptyDataView } from '@/components/shared/empty-data-view'
import { SkeletonList } from '@/components/shared/skeleton-list'
import { Button } from '@/components/ui/button'
import { useInnerJournalEntries } from '@/hooks/api/use-inner-journal'
import { PATHS } from '@/lib/constants'
import { t } from '@/lib/i18n'

const InnerJournalHistoryPage = () => {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInnerJournalEntries({
      limit: 20,
    })

  const entries = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data?.data ?? []) ?? []
  }, [data])

  const showLoading = isLoading && entries.length === 0
  const isEmpty = !showLoading && entries.length === 0

  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          description={t('pages.innerJournalHistory.header.description')}
          note={t('pages.innerJournalHistory.header.note')}
          subtitle={t('pages.innerJournalHistory.header.subtitle')}
          title={t('pages.innerJournalHistory.header.title')}
        />

        {showLoading && <SkeletonList />}
        {isEmpty && (
          <EmptyDataView
            Icon={<BookOpenIcon />}
            description={t('pages.innerJournalHistory.empty.description')}
            title={t('pages.innerJournalHistory.empty.title')}
          />
        )}

        {!showLoading && !isEmpty && (
          <div className='flex flex-col gap-3'>
            {entries.map((entry) => (
              <InnerJournalHistoryItem key={entry.id} entry={entry} />
            ))}

            {hasNextPage && (
              <div className='flex justify-center py-4'>
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

            <Button asChild className='w-full rounded-full'>
              <Link to={PATHS.INNER_JOURNAL}>{t('pages.innerJournalHistory.writeNew')}</Link>
            </Button>
          </div>
        )}
      </MainColumn>

      <SideColumn hideInMobile>
        <MiniCheckInCard />
        <DailyQuoteCard />
        <WeeklyRhythmCard />
      </SideColumn>
    </MainContainer>
  )
}

export default InnerJournalHistoryPage
