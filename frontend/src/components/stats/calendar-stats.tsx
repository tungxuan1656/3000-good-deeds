import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { vi } from 'date-fns/locale'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { useCalendar } from '@/hooks/api/use-activities'
import { PATHS } from '@/lib/constants'
import { cn } from '@/lib/utils'

import { CardSection } from '../shared'
import { Button } from '../ui/button'

const weekdayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

export const CalendarStats = () => {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()))

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const from = format(monthStart, 'yyyy-MM-dd')
  const to = format(monthEnd, 'yyyy-MM-dd')
  const { data, isLoading } = useCalendar(from, to)
  const calendar = data?.data ?? []

  const counts = useMemo(() => {
    return new Map(calendar.map((item) => [item.date, item.count]))
  }, [calendar])

  const days = useMemo(() => {
    const dayList: Date[] = []
    let day = calendarStart

    while (isBefore(day, calendarEnd) || day.getTime() === calendarEnd.getTime()) {
      dayList.push(day)
      day = addDays(day, 1)
    }

    return dayList
  }, [calendarStart, calendarEnd])

  return (
    <div>
      <div className='mx-2 mt-4 flex flex-wrap items-center justify-between gap-3'>
        <h2 className='text-foreground text-xl font-semibold'>
          {format(currentMonth, 'MMMM/yyyy', { locale: vi }).toUpperCase()}
        </h2>
        <div className='flex items-center gap-2'>
          <Button
            className='h-9 w-9 rounded-full'
            size='icon'
            variant='outline'
            onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            className='h-9 w-9 rounded-full'
            size='icon'
            variant='outline'
            onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <CardSection>
        <div className='mb-5 flex items-center justify-between gap-2'>
          <p className='text-foreground font-semibold'>Tổng quan tháng</p>
          <Link
            className='text-foreground/80 hover:text-foreground -mr-2 px-2 text-xs'
            to={PATHS.TIMELINE}>
            Xem timeline
          </Link>
        </div>

        <div className='text-foreground/80 grid grid-cols-7 gap-2 text-center text-xs font-semibold'>
          {weekdayLabels.map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>

        <div className='mt-2 grid grid-cols-7 gap-2'>
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd')
            const count = counts.get(key) ?? 0
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isFuture = isAfter(day, new Date())
            const isCurrentDay = isToday(day)

            return (
              <div
                key={key}
                className={cn(
                  'flex min-h-16 flex-col items-center justify-between rounded-2xl border border-black/5 bg-white/80 p-2 shadow-sm',
                  !isCurrentMonth && 'opacity-50',
                  isFuture && 'opacity-40',
                  isCurrentDay && 'ring-primary/40 ring-2 ring-offset-2 ring-offset-white',
                )}>
                <span className='text-foreground text-sm font-semibold'>{format(day, 'd')}</span>
                {isLoading ? (
                  <span className='bg-muted h-4 w-10 animate-pulse rounded-full' />
                ) : count > 0 ? (
                  <span className='bg-primary/15 text-primary rounded-full px-2 py-1 text-xs font-semibold'>
                    {count}
                  </span>
                ) : (
                  <span className='text-muted-foreground text-xs'>—</span>
                )}
              </div>
            )
          })}
        </div>
      </CardSection>
    </div>
  )
}
