import { format, isToday, isYesterday } from 'date-fns'
import { vi } from 'date-fns/locale'
import { BookOpenIcon } from 'lucide-react'
import * as React from 'react'

import { InnerJournalHistoryItem } from '@/components/inner'
import { EmptyDataView, SkeletonList } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { useInnerJournalEntries } from '@/hooks/api/use-inner-journal'
import { t } from '@/lib/i18n'
import type { JournalEntryDTO } from '@/types/api'

export const ReflectionHistory = () => {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInnerJournalEntries({
      limit: 10,
    })

  const entries = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data?.data ?? []) ?? []
  }, [data])

  const historyGroups = React.useMemo(() => {
    const groupMap = new Map<
      string,
      { dateKey: string; dateLabel: string; items: JournalEntryDTO[] }
    >()
    const groupOrder: string[] = []

    entries.forEach((item) => {
      const date = new Date(item.createdAt)
      const dateKey = format(date, 'dd/MM/yyyy')

      let dateLabel = format(date, 'dd/MM', { locale: vi })
      if (isToday(date)) {
        dateLabel = t('pages.timeline.dateLabel.today', { date: dateLabel })
      } else if (isYesterday(date)) {
        dateLabel = t('pages.timeline.dateLabel.yesterday', { date: dateLabel })
      } else {
        dateLabel = t('pages.timeline.dateLabel.day', { date: dateLabel })
      }

      if (!groupMap.has(dateKey)) {
        groupMap.set(dateKey, { dateKey, dateLabel, items: [] })
        groupOrder.push(dateKey)
      }

      groupMap.get(dateKey)!.items.push(item)
    })

    return groupOrder.map((key) => groupMap.get(key)!)
  }, [entries])

  const showLoading = isLoading && entries.length === 0
  const isEmpty = !showLoading && historyGroups.length === 0

  return (
    <div className='gap-4'>
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
          {historyGroups.map((group) => (
            <div key={group.dateKey} className='gap-2'>
              <div className='mb-2 flex flex-wrap items-center justify-between gap-2 px-1'>
                <h3 className='font-headline text-primary text-base italic md:text-lg'>
                  {group.dateLabel}
                </h3>
              </div>

              <div className='flex flex-col gap-3'>
                {group.items.map((entry) => (
                  <InnerJournalHistoryItem key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
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
    </div>
  )
}
