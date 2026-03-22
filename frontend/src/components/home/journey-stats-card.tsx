import { useStatsSummary } from '@/hooks/api/use-stats'

import { Card, CardContent, CardHeader } from '../ui/card'
import { Progress } from '../ui/progress'

const GOAL_TOTAL = 3000

export const JourneyStatsCard = () => {
  const { data: statsResponse, isLoading } = useStatsSummary()
  const totalDeeds = statsResponse?.data.totalDeeds ?? 0
  const progress = Math.min((totalDeeds / GOAL_TOTAL) * 100, 100)

  return (
    <Card padding='none' variant='surface'>
      <CardHeader className='p-8 pb-0'>
        <p className='text-[10px] font-bold tracking-[0.2em] text-stone-700 uppercase'>
          Your Journey
        </p>
      </CardHeader>

      <CardContent className='space-y-8 p-8 pt-6'>
        <div className='flex items-baseline justify-between'>
          <span className='text-5xl font-medium tracking-tighter text-stone-800'>
            {isLoading ? '--' : totalDeeds.toLocaleString()}
          </span>
          <span className='text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase'>
            Deeds Logged
          </span>
        </div>

        <div className='space-y-4'>
          <Progress className='h-1.5 bg-stone-200/50 dark:bg-stone-800' value={progress} />
          <p className='text-[10px] font-bold tracking-wider text-stone-400 uppercase'>
            {progress.toFixed(1)}% of the way to {GOAL_TOTAL.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
