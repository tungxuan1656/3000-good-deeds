import { endOfDay, format, startOfDay } from 'date-fns'
import { vi } from 'date-fns/locale'
import { LightbulbIcon } from 'lucide-react'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'

import type { SuggestActsDrawerHandle } from '@/components/shared'
import {
  CardSection,
  EmptyDataView,
  GoodDeedCard,
  Leaf,
  SkeletonList,
  SuggestActsSheet,
} from '@/components/shared'
import { Button } from '@/components/ui/button'
import { useDeeds } from '@/hooks/api/use-deeds'
import { PATHS } from '@/lib/constants'
import { t } from '@/lib/i18n'

export const TodaySection = () => {
  const navigate = useNavigate()
  const suggestActsDrawerRef = React.useRef<SuggestActsDrawerHandle>(null)

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
    limit: 20,
  })
  const deeds = deedsResponse?.pages.flatMap((page) => page.data?.data ?? []) ?? []
  const showLoading = (isLoading || isFetching) && deeds.length === 0
  const isEmpty = !showLoading && deeds.length === 0

  return (
    <CardSection>
      <Leaf position='top-left' variant={4} />
      <div className='mb-4 flex items-start justify-between gap-3'>
        <div>
          <h2 className='text-foreground text-lg font-semibold'>{t('home.todaySection.title')}</h2>
          <p className='text-muted-foreground mt-1 text-xs sm:text-sm'>
            {format(new Date(), t('dates.formats.dayMonth'), { locale: vi })}
          </p>
          <p className='text-muted-foreground mt-2 text-sm'>{t('home.todaySection.subtitle')}</p>
        </div>
        <Button
          className='text-foreground/80 hover:text-foreground -mr-2 h-8 px-2 text-xs'
          size='sm'
          variant='ghost'
          onClick={() => navigate(PATHS.TIMELINE)}>
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

      <Button
        className='mt-4 self-center rounded-full px-5'
        size='sm'
        onClick={() => suggestActsDrawerRef.current?.open()}>
        <LightbulbIcon className='size-4' />
        {t('home.todaySection.suggestAction')}
      </Button>

      <SuggestActsSheet ref={suggestActsDrawerRef} />
    </CardSection>
  )
}
