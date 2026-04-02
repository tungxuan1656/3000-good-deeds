import { formatDate } from 'date-fns'
import { CheckCircle2Icon, GoalIcon } from 'lucide-react'

import { GOAL_LABELS } from '@/lib/constants'
import { t } from '@/lib/i18n'
import type { GoalHistoryDTO } from '@/types/api'

import { Card } from '../ui'

export const GoalHistoryItem = ({
  goalHistory,
}: {
  goalHistory: GoalHistoryDTO
}) => {
  return (
    <Card className='flex items-center gap-3' padding='sm'>
      <div className='bg-primary/15 flex size-8 items-center justify-center rounded-full'>
        <GoalIcon className='text-primary' size={16} />
      </div>
      <div className='flex flex-1 flex-col'>
        <div className='flex items-center justify-between'>
          <p className='text-foreground text-sm md:text-base'>
            {GOAL_LABELS[goalHistory.type]}
          </p>
          <span className='text-muted-foreground text-xs'>
            {formatDate(goalHistory.startDate, 'dd/MM')} -
            {formatDate(goalHistory.endDate, 'dd/MM')}
          </span>
        </div>
        <div className='text-muted-foreground tracking-xs flex flex-row items-center gap-1 text-xs leading-relaxed md:text-sm'>
          <CheckCircle2Icon className='text-primary h-3.5 w-3.5' />
          {goalHistory.completed
            ? t('goals.history.completed')
            : t('goals.history.progress', {
                actualCount: goalHistory.actualCount,
                targetCount: goalHistory.targetCount,
              })}
        </div>
      </div>
    </Card>
  )
}
