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

const MOOD_EMOJIS: Record<string, string> = {
  peaceful: '🕊️',
  grateful: '🙏',
  lightHearted: '🍃',
  warm: '☀️',
  calm: '🧘',
  hopeful: '🌱',
  'hồi tưởng': '💭',
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
    <div className='mt-8 space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-baseline gap-3'>
          <h2 className='font-headline text-foreground text-xl font-bold'>Today's Summary</h2>
          <span className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
            {format(new Date(), 'EEEE, MMM d', { locale: vi })}
          </span>
        </div>
        <Button
          className='text-muted-foreground hover:text-primary text-xs font-medium'
          size='sm'
          variant='ghost'
          onClick={() => navigate(PATHS.TIMELINE)}>
          View All <ChevronRight className='ml-1 size-3' />
        </Button>
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
        <div className='flex flex-col gap-6'>
          {deeds.map((deed) => {
            const firstTag = deed.labels?.split(',')[0]
            const emoji = firstTag ? MOOD_EMOJIS[firstTag] || '✨' : '✨'

            return (
              <div key={deed.id} className='group flex items-start gap-4'>
                <div className='group-hover:bg-primary/10 flex size-12 shrink-0 items-center justify-center rounded-full bg-stone-100 transition-colors dark:bg-stone-800'>
                  <span className='text-xl'>{emoji}</span>
                </div>

                <div className='flex flex-1 flex-col gap-1.5 pt-1'>
                  <p className='text-foreground text-sm leading-relaxed'>{deed.description}</p>

                  <div className='flex items-center gap-3'>
                    {deed.labels && (
                      <span className='text-muted-foreground/80 rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase dark:bg-stone-800'>
                        {deed.labels.split(',')[0]}
                      </span>
                    )}
                    <span className='text-muted-foreground text-[10px] font-medium'>
                      {format(deed.performedAt, 'h:mm a')}
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
