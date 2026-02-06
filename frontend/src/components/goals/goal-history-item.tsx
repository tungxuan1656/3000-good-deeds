import { formatDate } from 'date-fns'
import { CheckCircle2Icon } from 'lucide-react'

import { GOAL_LABELS } from '@/lib/constants'
import type { GoalHistoryDTO } from '@/types/api'

import { CardInlineSection } from '../shared/card-inline-section'

export const GoalHistoryItem = ({ goalHistory }: { goalHistory: GoalHistoryDTO }) => {
  return (
    <CardInlineSection>
      <div className='flex items-center justify-between'>
        <p className='text-foreground text-sm font-semibold'>{GOAL_LABELS[goalHistory.type]}</p>
        <span className='text-muted-foreground text-xs'>
          {formatDate(goalHistory.startDate, 'dd/MM')} -{formatDate(goalHistory.endDate, 'dd/MM')}
        </span>
      </div>
      <div className='text-foreground flex items-center gap-2 text-xs font-medium'>
        <CheckCircle2Icon className='text-primary h-3.5 w-3.5' />
        {goalHistory.completed
          ? 'Đã hoàn thành'
          : `Hoàn thành ${goalHistory.actualCount}/${goalHistory.targetCount}`}
      </div>
    </CardInlineSection>
  )
}
