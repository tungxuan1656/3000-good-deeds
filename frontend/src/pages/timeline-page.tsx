import { format, isToday, isYesterday } from 'date-fns'
import { vi } from 'date-fns/locale'
import * as React from 'react'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import { CardSection } from '@/components/shared/card-section'
import { DailyQuoteCard } from '@/components/shared/daily-quote-card'
import { MiniCheckInCard } from '@/components/shared/mini-check-in-card'
import { WeeklyRhythmCard } from '@/components/shared/weekly-rhythm-card'
import { useCategories } from '@/hooks/api/use-categories'
import { useDeeds } from '@/hooks/api/use-deeds'
import type { DeedDTO } from '@/types/api'

const TimelinePage = () => {
  const { codeToCategoryMap } = useCategories()
  const { data: deedsResponse, isLoading, isFetching } = useDeeds({ limit: 50 })
  const deeds = deedsResponse?.data ?? []

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

  const showLoading = (isLoading || isFetching) && deeds.length === 0
  const isEmpty = !showLoading && timelineGroups.length === 0

  return (
    <MainContainer>
      <MainColumn>
        <CardSection as='header'>
          <p className='text-muted-foreground text-[11px] font-semibold tracking-[0.25em] uppercase sm:text-xs'>
            Hành trình
          </p>
          <h1 className='text-foreground mt-2 text-2xl font-semibold tracking-tight sm:text-[28px]'>
            Nhật ký việc thiện
          </h1>
          <p className='text-muted-foreground/90 mt-3 max-w-2xl text-sm leading-relaxed sm:text-base'>
            Nơi lưu giữ những điều tốt đẹp theo dòng thời gian.
          </p>
        </CardSection>

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
                  {group.items.map((item) => {
                    const meta = codeToCategoryMap[item.categoryCode]

                    return (
                      <div
                        key={item.id}
                        className='border-primary/30 flex flex-col gap-3 rounded-2xl border-2 bg-white/85 px-3 py-2 transition-shadow hover:shadow-md'>
                        <div className='flex items-center gap-3 sm:gap-4'>
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-2xl ${meta.style}`}>
                            <img alt={meta.name} className='h-6 w-6' src={meta.icon} />
                          </div>
                          <div className='flex-1'>
                            <p className='text-foreground text-base font-semibold'>{meta.name}</p>
                            <p className='text-muted-foreground text-sm'>{item.labels}</p>
                          </div>
                        </div>

                        <p className='text-foreground text-sm leading-relaxed'>
                          {item.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </CardSection>
            ))}
          </div>
        )}
      </MainColumn>

      <SideColumn hideInMobile>
        <MiniCheckInCard />
        <DailyQuoteCard />
        <WeeklyRhythmCard
          activeCount={4}
          description='4/7 ngày đã gieo hạt. Hãy giữ nhịp nhẹ nhàng.'
        />
      </SideColumn>
    </MainContainer>
  )
}

export default TimelinePage
