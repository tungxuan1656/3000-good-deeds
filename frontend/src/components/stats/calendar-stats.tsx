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
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'

import { Card } from '../ui'
import { Button } from '../ui/button'

// Language-change in this app triggers a full page reload, so module-level t() calls are safe.
const weekdayLabels = [
  t('stats.calendar.weekdays.mon'),
  t('stats.calendar.weekdays.tue'),
  t('stats.calendar.weekdays.wed'),
  t('stats.calendar.weekdays.thu'),
  t('stats.calendar.weekdays.fri'),
  t('stats.calendar.weekdays.sat'),
  t('stats.calendar.weekdays.sun'),
]

export const CalendarStats = () => {
  const [currentMonth, setCurrentMonth] = useState(() =>
    startOfMonth(new Date()),
  )

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

    while (
      isBefore(day, calendarEnd) ||
      day.getTime() === calendarEnd.getTime()
    ) {
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
        <div className='mb-2 flex items-center gap-2'>
          <Button
            className='bg-card h-9 w-9 rounded-full shadow-sm'
            size='icon'
            variant='outline'
            onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            className='bg-card h-9 w-9 rounded-full shadow-sm'
            size='icon'
            variant='outline'
            onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <Card>
        <div className='mb-5 flex items-center justify-between gap-2'>
          <p className='text-foreground font-semibold'>
            {t('stats.calendar.monthOverview')}
          </p>
          <Link
            className='text-foreground/80 hover:text-foreground -mr-2 px-2 text-xs'
            to={PATHS.TIMELINE}>
            {t('stats.calendar.viewTimeline')}
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
                  'bg-card/80 border-border/45 flex min-h-16 flex-col items-center justify-between rounded-2xl border p-2 shadow-sm',
                  !isCurrentMonth && 'border-none opacity-50 shadow-none',
                  isFuture && 'opacity-40',
                  isCurrentDay &&
                    'ring-primary/40 ring-offset-background ring-2 ring-offset-2',
                )}>
                {isCurrentMonth ? (
                  <>
                    <span className='text-foreground text-sm font-semibold'>
                      {format(day, 'd')}
                    </span>
                    {isLoading ? (
                      <span className='bg-muted h-4 w-10 animate-pulse rounded-full' />
                    ) : count > 0 ? (
                      <span className='bg-primary/15 text-primary rounded-full px-2 py-1 text-xs font-semibold'>
                        {count}
                      </span>
                    ) : (
                      <span className='text-muted-foreground text-xs'>—</span>
                    )}
                  </>
                ) : null}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
