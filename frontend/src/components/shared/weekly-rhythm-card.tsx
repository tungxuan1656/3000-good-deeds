import { addDays, format, isAfter, isToday, startOfWeek } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { CardSection } from '@/components/shared/card-section'
import { Button } from '@/components/ui/button'
import { useWeeklyRhythm } from '@/hooks/api/use-activities'
import { PATHS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const defaultDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

export const WeeklyRhythmCard = () => {
  const navigate = useNavigate()
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 })

  const from = startOfCurrentWeek.setHours(0, 0, 0, 0)
  const to = addDays(startOfCurrentWeek, 6).setHours(23, 59, 59, 999)

  const { data } = useWeeklyRhythm(from, to)
  const rhythm = data?.data ?? []

  const days = useMemo(() => {
    if (rhythm.length === 7) return rhythm

    return defaultDays.map((_, index) => {
      const date = addDays(startOfCurrentWeek, index)
      const key = format(date, 'yyyy-MM-dd')

      return {
        date: key,
        count: 0,
      }
    })
  }, [rhythm, startOfCurrentWeek])

  const activeCount = days.filter((day) => day.count > 0).length

  return (
    <CardSection padding='md'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <h3 className='text-foreground text-base font-semibold'>Nhịp điệu trong tuần</h3>
          <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
            {activeCount}/7 ngày đã gieo hạt. Hãy giữ nhịp nhẹ nhàng.
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
      <div className='mt-4 flex gap-2'>
        {days.map((day, index) => {
          const date = new Date(day.date)
          const isFuture = isAfter(date, new Date())
          const isActive = day.count > 0
          const isCurrentDay = isToday(date)

          return (
            <div
              key={day.date}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition',
                isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground',
                isCurrentDay && 'ring-primary/50 ring-2 ring-offset-2 ring-offset-white',
                isFuture && 'opacity-40',
              )}>
              {defaultDays[index]}
            </div>
          )
        })}
      </div>
      <p className='text-muted-foreground/70 mt-3 text-[11px]'>
        Tuần này · {format(startOfCurrentWeek, 'dd/MM', { locale: vi })} -{' '}
        {format(addDays(startOfCurrentWeek, 6), 'dd/MM', { locale: vi })}
      </p>
    </CardSection>
  )
}
