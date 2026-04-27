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
import { useEffect, useMemo, useState } from 'react'

import { useCalendar } from '@/hooks/api/use-activities'
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

const intensityLabels = [
  t('stats.calendar.levels.none'),
  t('stats.calendar.levels.light'),
  t('stats.calendar.levels.steady'),
  t('stats.calendar.levels.radiant'),
]

export const CalendarStats = () => {
  const [referenceDate, setReferenceDate] = useState<Date | null>(null)
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null)

  useEffect(() => {
    const now = new Date()
    setReferenceDate(now)
    setCurrentMonth(startOfMonth(now))
  }, [])

  const effectiveReferenceDate = referenceDate ?? new Date(0)
  const effectiveCurrentMonth = currentMonth ?? startOfMonth(effectiveReferenceDate)

  const monthStart = startOfMonth(effectiveCurrentMonth)
  const monthEnd = endOfMonth(effectiveCurrentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const from = format(monthStart, 'yyyy-MM-dd')
  const to = format(monthEnd, 'yyyy-MM-dd')
  const { data, isLoading } = useCalendar(from, to)
  const calendar = data?.data ?? []

  const maxCount = useMemo(
    () => calendar.reduce((max, item) => Math.max(max, item.count), 0),
    [calendar],
  )

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

  const getIntensityClassName = (
    count: number,
    isCurrentMonthDay: boolean,
    isFutureDay: boolean,
  ) => {
    if (!isCurrentMonthDay) return 'bg-stone-50 text-muted-foreground'
    if (isFutureDay || isLoading) return 'bg-stone-100 text-muted-foreground/25'
    if (count <= 0 || maxCount <= 0) return 'bg-stone-100 text-muted-foreground'

    const ratio = count / maxCount
    if (ratio >= 0.8) return 'bg-primary text-stone-100'
    if (ratio >= 0.5) return 'bg-primary/70 text-stone-100'

    return 'bg-primary/30 text-primary'
  }

  const legendToneClassName = [
    'bg-stone-100',
    'bg-primary/30',
    'bg-primary/70',
    'bg-primary',
  ]

  if (!referenceDate || !currentMonth) {
    return <Card />
  }

  return (
    <div>
      <div className='mx-2 mt-4 mb-4 flex flex-wrap items-center justify-between gap-3'>
        <h2 className='text-foreground text-2xl leading-tight font-medium tracking-tight'>
          {t('stats.calendar.activityTitle', {
            month: format(effectiveCurrentMonth, 'M', { locale: vi }),
          })}
        </h2>
        <div className='mb-2 flex items-center gap-1'>
          <Button
            className='text-muted-foreground h-9 w-9 rounded-full border-none bg-transparent shadow-none hover:bg-stone-100 hover:text-stone-700'
            size='icon'
            variant='outline'
            onClick={() =>
              setCurrentMonth((prev) =>
                subMonths(prev ?? effectiveCurrentMonth, 1),
              )
            }>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            className='text-muted-foreground h-9 w-9 rounded-full border-none bg-transparent shadow-none hover:bg-stone-100 hover:text-stone-700'
            size='icon'
            variant='outline'
            onClick={() =>
              setCurrentMonth((prev) =>
                addMonths(prev ?? effectiveCurrentMonth, 1),
              )
            }>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <Card className='md:flex md:flex-row md:gap-5'>
        <div className='md:flex md:flex-1 md:flex-col'>
          <div className='text-xss text-muted-foreground mb-3 grid grid-cols-7 gap-2 text-center font-semibold tracking-wide uppercase'>
            {weekdayLabels.map((label) => (
              <div key={label}>{label}</div>
            ))}
          </div>

          <div className='mt-2 grid grid-cols-7 gap-1'>
            {days.map((day) => {
              const key = format(day, 'yyyy-MM-dd')
              const count = counts.get(key) ?? 0
              const isCurrentMonth = isSameMonth(day, effectiveCurrentMonth)
              const isFuture = isAfter(day, effectiveReferenceDate)
              const isCurrentDay = isToday(day)

              return (
                <div
                  key={key}
                  className={cn(
                    'flex aspect-square items-center justify-center rounded-xs text-xs font-medium md:aspect-auto md:py-5 md:text-sm',
                    getIntensityClassName(count, isCurrentMonth, isFuture),
                    isCurrentDay && 'ring-primary/30 ring-1 ring-offset-1',
                  )}>
                  {isCurrentMonth ? <span>{format(day, 'd')}</span> : null}
                </div>
              )
            })}
          </div>
        </div>

        <div className='mt-5 flex flex-wrap items-center gap-5 md:mt-10 md:flex-col md:items-end md:gap-3'>
          {intensityLabels.map((label, index) => (
            <div key={label} className='flex items-center gap-2'>
              <span className='text-xss font-semibold tracking-wide text-stone-500 uppercase'>
                {label}
              </span>
              <span
                className={cn('h-3 w-3 rounded-xs', legendToneClassName[index])}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
