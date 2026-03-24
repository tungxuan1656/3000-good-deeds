import { format, isToday, isYesterday } from 'date-fns'
import { vi } from 'date-fns/locale'
import { LeafyGreenIcon, Loader2 } from 'lucide-react'
import * as React from 'react'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  CardSection,
  DailyQuoteCard,
  EmptyDataView,
  GoodDeedCard,
  HeaderSection,
  InfoButton,
  MiniCheckInCard,
  SkeletonList,
  WeeklyRhythmCard,
} from '@/components/shared'
import { Button } from '@/components/ui/button'
import { useDeeds } from '@/hooks/api/use-deeds'
import { INFO_COPY } from '@/lib/constants/info-copy'
import { t } from '@/lib/i18n'
import type { DeedDTO } from '@/types/api'

const TimelinePage = () => {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useDeeds({
    limit: 20,
  })

  const deeds = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data?.data ?? []) ?? []
  }, [data])

  const timelineGroups = React.useMemo(() => {
    const groupMap = new Map<string, { dateKey: string; dateLabel: string; items: DeedDTO[] }>()
    const groupOrder: string[] = []

    deeds.forEach((item) => {
      const performedAt = item.performedAt || item.createdAt
      const date = new Date(performedAt)
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
  }, [deeds])

  const showLoading = isLoading && deeds.length === 0
  const isEmpty = !showLoading && timelineGroups.length === 0

  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          action={
            <InfoButton
              description={INFO_COPY.timeline.description}
              title={INFO_COPY.timeline.title}
            />
          }
          description={t('pages.timeline.header.description')}
          title={t('pages.timeline.header.title')}
        />

        {showLoading && <SkeletonList />}
        {isEmpty && (
          <EmptyDataView
            Icon={<LeafyGreenIcon />}
            description={t('pages.timeline.empty.description')}
            title={t('pages.timeline.empty.title')}
          />
        )}

        {!showLoading && !isEmpty && (
          <div className='flex flex-col gap-4'>
            {timelineGroups.map((group) => (
              <CardSection key={group.dateKey} className='gap-2'>
                <div className='mb-2 flex flex-wrap items-center justify-between gap-2'>
                  <p className='text-foreground text-sm font-semibold tracking-widest uppercase'>
                    {group.dateLabel}
                  </p>
                  <span className='text-muted-foreground text-sm sm:text-xs'>
                    {t('pages.timeline.groupCount', { count: group.items.length })}
                  </span>
                </div>
                <div className='flex flex-col gap-3'>
                  {group.items.map((item) => (
                    <GoodDeedCard key={item.id} deed={item} />
                  ))}
                </div>
              </CardSection>
            ))}

            {hasNextPage && (
              <div className='flex justify-center py-4'>
                <Button
                  disabled={isFetchingNextPage}
                  variant='outline'
                  onClick={() => void fetchNextPage()}>
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      {t('pages.timeline.loadingMore')}
                    </>
                  ) : (
                    t('pages.timeline.loadMore')
                  )}
                </Button>
              </div>
            )}
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

export default TimelinePage
