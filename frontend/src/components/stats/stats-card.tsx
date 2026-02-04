import { useStatsSummary } from '@/hooks/api/use-stats'

import { CardSection } from '../shared'

export const StatsCard = () => {
  const { data, isLoading } = useStatsSummary()
  const summary = data?.data
  const isEmpty = !isLoading && !summary

  const summaryCards = [
    {
      title: 'Tổng',
      value: (summary ? String(summary.totalDeeds) : '--') + ' việc thiện',
    },
    {
      title: 'Chuỗi ngày',
      value: summary ? `${summary.streakDays} ngày` : '--',
    },
  ]

  return (
    <>
      {isLoading && (
        <div className='flex flex-col gap-4'>
          {[1, 2, 3].map((item) => (
            <div key={item} className='rounded-2xl border border-black/5 bg-white/80 p-4 shadow-sm'>
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
        <div className='flex flex-row gap-5'>
          {summaryCards.map((card) => {
            return (
              <CardSection key={card.title} className='flex-1'>
                <div className='flex items-start justify-between gap-3'>
                  <p className='text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase sm:text-xs'>
                    {card.title}
                  </p>
                </div>
                <p className='text-foreground text-xl leading-tight font-semibold sm:text-3xl'>
                  {card.value}
                </p>
              </CardSection>
            )
          })}
        </div>
      )}
    </>
  )
}
