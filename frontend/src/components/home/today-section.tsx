import { endOfDay, format, startOfDay } from 'date-fns'
import { vi } from 'date-fns/locale'
import { LightbulbIcon } from 'lucide-react'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'

import { CardSection } from '@/components/shared/card-section'
import Leaf from '@/components/shared/leaf'
import {
  type SuggestActsDrawerHandle,
  SuggestActsSheet,
} from '@/components/shared/suggest-acts-sheet'
import { Button } from '@/components/ui/button'
import { useDeeds } from '@/hooks/api/use-deeds'
import { PATHS } from '@/lib/constants'

import { GoodDeedCard } from '../shared'

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
  const deeds = deedsResponse?.data ?? []
  const showLoading = (isLoading || isFetching) && deeds.length === 0
  const isEmpty = !showLoading && deeds.length === 0

  return (
    <CardSection>
      <Leaf position='top-left' variant={4} />
      <div className='mb-4 flex items-start justify-between gap-3'>
        <div>
          <h2 className='text-foreground text-lg font-semibold'>Hôm nay</h2>
          <p className='text-muted-foreground mt-1 text-xs sm:text-sm'>
            {format(new Date(), "EEEE, 'ngày' dd 'tháng' MM", { locale: vi })}
          </p>
        </div>
        <Button
          className='text-foreground/80 hover:text-foreground -mr-2 h-8 px-2 text-xs'
          size='sm'
          variant='ghost'
          onClick={() => navigate(PATHS.TIMELINE)}>
          Xem tất cả
        </Button>
      </div>

      {showLoading && (
        <div className='flex flex-col gap-3'>
          {[1, 2].map((item) => (
            <div key={item} className='rounded-2xl border border-black/5 bg-white/80 p-4 shadow-sm'>
              <div className='bg-muted mb-2 h-4 w-24 animate-pulse rounded-full' />
              <div className='bg-muted h-10 w-full animate-pulse rounded-2xl' />
            </div>
          ))}
        </div>
      )}

      {isEmpty && (
        <div className='flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-black/10 bg-white/70 px-4 py-8 text-center sm:py-10'>
          <p className='text-muted-foreground text-sm leading-relaxed sm:text-base'>
            Chưa có việc thiện nào hôm nay.
            <br />
            Hãy gieo một hạt giống lành!
          </p>
        </div>
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
        Gợi ý điều nhỏ để bắt đầu
      </Button>

      <SuggestActsSheet ref={suggestActsDrawerRef} />
    </CardSection>
  )
}
