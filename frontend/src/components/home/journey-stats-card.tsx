import { useStatsSummary } from '@/hooks/api/use-stats'
import { t } from '@/lib/i18n'

import { Card, CardContent, CardHeader } from '../ui/card'
import { Progress } from '../ui/progress'

const GOAL_TOTAL = 3000
const NUMBER_LOCALE = 'vi-VN'

export const JourneyStatsCard = () => {
  const { data: statsResponse, isLoading } = useStatsSummary()
  const totalDeeds = statsResponse?.data.totalDeeds ?? 0
  const progress = Math.min((totalDeeds / GOAL_TOTAL) * 100, 100)

  return (
    <Card variant='surface'>
      <CardHeader>
        <p className='text-xss font-bold tracking-[0.2em] text-stone-700 uppercase'>
          {t('journey.stats.card.title')}
        </p>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='flex items-baseline justify-between'>
          <span className='text-5xl font-medium tracking-tighter text-stone-800'>
            {isLoading ? '--' : totalDeeds.toLocaleString(NUMBER_LOCALE)}
          </span>
          <span className='text-xss font-bold tracking-[0.2em] text-stone-400 uppercase'>
            {t('journey.stats.card.deedsLogged')}
          </span>
        </div>

        <div className='space-y-4'>
          <Progress
            className='h-1.5 bg-stone-200/50 dark:bg-stone-800'
            value={progress}
          />
          <p className='text-xss text-muted-foreground/50 font-bold tracking-wider uppercase'>
            {t('journey.stats.card.progressPrefix')}
            {progress.toFixed(1)}
            {t('journey.stats.card.progressSuffix', {
              total: GOAL_TOTAL.toLocaleString(NUMBER_LOCALE),
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
