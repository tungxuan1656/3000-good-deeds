import { endOfDay, format, startOfDay } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ChevronRight } from 'lucide-react'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'

import { EmptyDataView, SkeletonList } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { useDeeds } from '@/hooks/api/use-deeds'
import { PATHS } from '@/lib/constants'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const MOOD_EMOJIS: Record<string, string> = {
  peaceful: '🕊️',
  grateful: '🙏',
  lightHearted: '🍃',
  warm: '☀️',
  calm: '🧘',
  hopeful: '🌱',
  'hồi tưởng': '💭',
}

const CATEGORY_COLORS: Record<string, string> = {
  peaceful: 'bg-[#e2e8de]',
  grateful: 'bg-[#e2e8de]',
  lightHearted: 'bg-[#e2e8de]',
  warm: 'bg-[#f5e6cc]',
  calm: 'bg-[#e2e8de]',
  hopeful: 'bg-[#e2e8de]',
}

export const TodaySummarySection = () => {
  const navigate = useNavigate()

  const todayRange = React.useMemo(() => {
    const now = new Date()

    return {
      from: startOfDay(now).getTime(),
      to: endOfDay(now).getTime(),
    }
  }, [])

  const {
    data: deedsResponse,
    isLoading,
    isFetching,
  } = useDeeds({
    from: todayRange.from,
    to: todayRange.to,
    limit: 10,
  })

  const deeds = React.useMemo(
    () => deedsResponse?.pages.flatMap((page) => page.data?.data ?? []) ?? [],
    [deedsResponse],
  )

  const showLoading = (isLoading || isFetching) && deeds.length === 0
  const isEmpty = !showLoading && deeds.length === 0

  return (
    <div className='mt-12 space-y-8'>
      <div className='flex items-baseline justify-between border-b border-stone-100 pb-4'>
        <h2 className='font-headline text-3xl font-medium text-stone-800'>
          Today's Summary
        </h2>
        <div className='flex items-center gap-4'>
          <span className='text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase'>
            {format(new Date(), 'EEEE, MMM d', { locale: vi }).toUpperCase()}
          </span>
          <Button
            className='hover:text-primary h-auto p-0 text-[10px] font-bold tracking-wider text-stone-400 uppercase hover:bg-transparent'
            variant='ghost'
            onClick={() => navigate(PATHS.TIMELINE)}>
            View All <ChevronRight className='ml-1 size-3' />
          </Button>
        </div>
      </div>

      {showLoading && <SkeletonList length={3} />}

      {isEmpty && (
        <div className='rounded-2xl bg-stone-50/50 p-8 dark:bg-stone-900/30'>
          <EmptyDataView
            description={t('home.todaySection.emptyDescription')}
            title={t('home.todaySection.emptyTitle')}
          />
        </div>
      )}

      {!showLoading && !isEmpty && (
        <div className='space-y-2'>
          {deeds.map((deed, index) => {
            const firstTag = deed.labels?.split(',')[0] || ''
            const emoji = MOOD_EMOJIS[firstTag] || '✨'
            const bgColor = CATEGORY_COLORS[firstTag] || 'bg-stone-100'

            return (
              <div
                key={deed.id}
                className={cn(
                  'group flex items-start gap-6 rounded-2xl p-6 transition-all',
                  index % 2 === 1
                    ? 'bg-surface-container-low dark:bg-stone-900/30'
                    : 'bg-transparent',
                )}>
                <div
                  className={cn(
                    'flex size-14 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-105',
                    bgColor,
                  )}>
                  <span className='text-2xl'>{emoji}</span>
                </div>

                <div className='flex flex-1 flex-col gap-3 pt-1'>
                  <p className='text-base leading-relaxed font-medium text-stone-700'>
                    {deed.description}
                  </p>

                  <div className='flex items-center gap-3'>
                    {deed.labels && (
                      <span className='rounded-lg bg-stone-200/50 px-2.5 py-1 text-[9px] font-bold tracking-wider text-stone-500 uppercase dark:bg-stone-800 dark:text-stone-400'>
                        {firstTag}
                      </span>
                    )}
                    <span className='text-[9px] font-bold tracking-wider text-stone-400'>
                      {format(deed.performedAt, 'h:mm a').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
