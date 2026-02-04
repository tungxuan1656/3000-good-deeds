import { CalendarIcon, TrendingUpIcon } from 'lucide-react'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import { CardSection } from '@/components/shared/card-section'
import { DailyQuoteCard } from '@/components/shared/daily-quote-card'
import { MiniCheckInCard } from '@/components/shared/mini-check-in-card'
import { useStatsSummary } from '@/hooks/api/use-stats'

const StatsPage = () => {
  const { data, isLoading } = useStatsSummary()
  const summary = data?.data
  const isEmpty = !isLoading && !summary

  const summaryCards = [
    {
      title: 'Tổng việc thiện',
      value: summary ? String(summary.totalDeeds) : '--',
      icon: TrendingUpIcon,
    },
    {
      title: 'Chuỗi ngày',
      value: summary ? `${summary.streakDays} ngày` : '--',
      icon: CalendarIcon,
    },
  ]

  return (
    <MainContainer>
      <MainColumn>
        <CardSection as='header' className='gap-3'>
          <p className='text-muted-foreground text-[11px] font-semibold tracking-[0.24em] uppercase sm:text-xs'>
            Thống kê
          </p>
          <h1 className='text-foreground text-[26px] font-semibold tracking-tight sm:text-[30px]'>
            Nhìn lại hành trình
          </h1>
          <p className='text-muted-foreground/90 max-w-2xl text-sm leading-relaxed sm:text-base'>
            Một góc nhỏ để thấy rõ nhịp điệu thiện lành của bạn.
          </p>
        </CardSection>

        {isLoading && (
          <div className='flex flex-col gap-4'>
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className='rounded-2xl border border-black/5 bg-white/80 p-4 shadow-sm'>
                <div className='bg-muted mb-3 h-4 w-32 animate-pulse rounded-full' />
                <div className='bg-muted h-24 w-full animate-pulse rounded-2xl' />
              </div>
            ))}
          </div>
        )}

        {isEmpty && !isLoading && (
          <CardSection className='text-muted-foreground text-center text-sm'>
            Chưa có dữ liệu thống kê. Hãy ghi nhận vài việc thiện đầu tiên.
          </CardSection>
        )}

        {!isEmpty && !isLoading && (
          <div className='flex flex-col gap-5'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {summaryCards.map((card) => {
                const Icon = card.icon

                return (
                  <CardSection key={card.title}>
                    <div className='flex items-start justify-between gap-3'>
                      <p className='text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase sm:text-xs'>
                        {card.title}
                      </p>
                      <div className='bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full'>
                        <Icon className='h-4 w-4' />
                      </div>
                    </div>
                    <p className='text-foreground text-2xl leading-tight font-semibold sm:text-3xl'>
                      {card.value}
                    </p>
                  </CardSection>
                )
              })}
            </div>
          </div>
        )}
      </MainColumn>

      <SideColumn>
        <MiniCheckInCard />
        <DailyQuoteCard />
      </SideColumn>
    </MainContainer>
  )
}

export default StatsPage
