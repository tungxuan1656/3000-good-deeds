import { format, isToday, isYesterday } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Loader2 } from 'lucide-react'
import * as React from 'react'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  CardSection,
  DailyQuoteCard,
  GoodDeedCard,
  HeaderSection,
  MiniCheckInCard,
  WeeklyRhythmCard,
} from '@/components/shared'
import { Button } from '@/components/ui/button'
import { useDeeds } from '@/hooks/api/use-deeds'
import type { DeedDTO } from '@/types/api'

const TimelinePage = () => {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useDeeds({
    limit: 20,
  })

  const deeds = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data?.data ?? []) ?? []
  }, [data])

  const timelineGroups = React.useMemo(() => {
    const groups: Array<{
      dateKey: string
      dateLabel: string
      items: DeedDTO[]
    }> = []

    deeds.forEach((item) => {
      const performedAt = item.performedAt || item.createdAt
      const date = new Date(performedAt)
      const dateKey = format(date, 'dd/MM/yyyy')

      let dateLabel = format(date, 'dd/MM', { locale: vi })
      if (isToday(date)) {
        dateLabel = `Hôm nay · ${dateLabel}`
      } else if (isYesterday(date)) {
        dateLabel = `Hôm qua · ${dateLabel}`
      } else {
        dateLabel = `Ngày ${dateLabel}`
      }

      const existingGroup = groups.find((group) => group.dateKey === dateKey)
      const targetGroup = existingGroup
        ? existingGroup
        : (() => {
            const nextGroup = {
              dateKey,
              dateLabel,
              items: [],
            }
            groups.push(nextGroup)

            return nextGroup
          })()

      targetGroup.items.push(item)
    })

    return groups
  }, [deeds])

  const showLoading = isLoading && deeds.length === 0
  const isEmpty = !showLoading && timelineGroups.length === 0

  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          description='Ghi lại việc thiện để nuôi dưỡng tâm từ bi và chánh niệm.'
          subtitle='Hành trình'
          title='Nhật ký việc thiện'
        />

        {showLoading && (
          <div className='flex flex-col gap-4'>
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className='rounded-2xl border border-black/5 bg-white/80 p-4 shadow-sm'>
                <div className='bg-muted mb-3 h-4 w-32 animate-pulse rounded-full' />
                <div className='flex flex-col gap-3'>
                  <div className='bg-muted h-16 w-full animate-pulse rounded-2xl' />
                  <div className='bg-muted h-16 w-full animate-pulse rounded-2xl' />
                </div>
              </div>
            ))}
          </div>
        )}

        {isEmpty && (
          <CardSection className='flex flex-col items-center justify-center gap-3 text-center'>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              Chưa có việc thiện nào.
              <br />
              Hãy bắt đầu từ một việc nhỏ.
            </p>
          </CardSection>
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
                    {group.items.length} việc thiện
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
                      Đang tải...
                    </>
                  ) : (
                    'Tải thêm'
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
