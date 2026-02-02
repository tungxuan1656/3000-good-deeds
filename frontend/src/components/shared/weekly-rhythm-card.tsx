import type { ReactNode } from 'react'

import { CardSection } from '@/components/shared/card-section'
import { cn } from '@/lib/utils'

type WeeklyRhythmCardProps = {
  title?: string
  description: string
  activeCount: number
  days?: string[]
  decoration?: ReactNode
  className?: string
}

const defaultDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

export const WeeklyRhythmCard = ({
  title = 'Nhịp điệu trong tuần',
  description,
  activeCount,
  days = defaultDays,
  decoration,
  className,
}: WeeklyRhythmCardProps) => {
  return (
    <CardSection className={cn(className)} padding='md'>
      {decoration}
      <h3 className='text-foreground text-base font-semibold'>{title}</h3>
      <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>{description}</p>
      <div className='mt-4 flex gap-2'>
        {days.map((day, index) => (
          <div
            key={day}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${
              index < activeCount ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
            {day}
          </div>
        ))}
      </div>
    </CardSection>
  )
}
