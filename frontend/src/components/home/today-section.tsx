'use client'

import { endOfDay, format, startOfDay } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import * as React from 'react'

import { EmptyDataView } from '@/components/shared/empty-data-view'
import { GoodDeedCard } from '@/components/shared/good-deed-card'
import { SkeletonList } from '@/components/shared/skeleton-list'
import { Button } from '@/components/ui/button'
import { useDeeds } from '@/hooks/api/use-deeds'
import { PATHS } from '@/lib/constants/paths'
import { t } from '@/lib/i18n'

export const TodaySection = () => {
  const router = useRouter()
  const [todayLabel, setTodayLabel] = React.useState<string | null>(null)

  const todayRange = React.useMemo(() => {
    const now = new Date()

    return {
      from: startOfDay(now).getTime(),
      to: endOfDay(now).getTime(),
    }
  }, [])

  React.useEffect(() => {
    setTodayLabel(format(new Date(), 'dd/MM', { locale: vi }))
  }, [])

  const {
    data: deedsResponse,
    isLoading,
    isFetching,
  } = useDeeds({
    from: todayRange.from,
    to: todayRange.to,
    limit: 20,
  })
  const deeds = React.useMemo(
    () => deedsResponse?.pages.flatMap((page) => page.data?.data ?? []) ?? [],
    [deedsResponse],
  )
  const showLoading = (isLoading || isFetching) && deeds.length === 0
  const isEmpty = !showLoading && deeds.length === 0

  return (
    <div>
      <div className='mb-2 flex items-start justify-between gap-3 px-2'>
        <h3 className='font-headline text-primary text-lg italic md:text-xl'>
          {todayLabel
            ? `${t('home.todaySection.title')} - ${todayLabel}`
            : t('home.todaySection.title')}
        </h3>
        <Button
          className='text-foreground/80 hover:text-foreground -mr-2 h-8 px-2 text-xs'
          size='sm'
          variant='ghost'
          onClick={() => router.push(PATHS.TIMELINE)}>
          {t('common.actions.viewAll')}
        </Button>
      </div>

      {showLoading && <SkeletonList length={1} />}
      {isEmpty && (
        <EmptyDataView
          description={t('home.todaySection.emptyDescription')}
          title={t('home.todaySection.emptyTitle')}
        />
      )}

      {!showLoading && !isEmpty && (
        <div className='flex flex-col gap-3'>
          {deeds.map((item) => (
            <GoodDeedCard key={item.id} deed={item} />
          ))}
        </div>
      )}
    </div>
  )
}
