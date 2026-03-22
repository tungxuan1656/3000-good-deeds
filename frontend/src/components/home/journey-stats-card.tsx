import { CardSection } from '@/components/shared'
import { Progress } from '@/components/ui/progress'
import { useStatsSummary } from '@/hooks/api/use-stats'

const GOAL_TOTAL = 3000

export const JourneyStatsCard = () => {
  const { data: statsResponse, isLoading } = useStatsSummary()
  const totalDeeds = statsResponse?.data.totalDeeds ?? 0
  const progress = Math.min((totalDeeds / GOAL_TOTAL) * 100, 100)

  return (
    <CardSection className='p-6'>
      <h3 className='font-headline text-primary mb-4 text-lg font-bold'>Your Journey</h3>

      <div className='mb-2 flex items-baseline justify-between'>
        <span className='foreground text-3xl font-bold'>
          {isLoading ? '--' : totalDeeds.toLocaleString()}
        </span>
        <span className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
          Deeds Logged
        </span>
      </div>

      <div className='mt-6 space-y-2'>
        <div className='text-muted-foreground flex justify-between text-xs'>
          <span>
            {((totalDeeds / GOAL_TOTAL) * 100).toFixed(1)}% of the way to {GOAL_TOTAL}
          </span>
        </div>
        <Progress className='h-2 bg-stone-100 dark:bg-stone-800' value={progress} />
      </div>

      <div className='bg-primary/5 border-primary/10 mt-8 flex items-center gap-3 rounded-xl border p-4'>
        <div className='bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full'>
          ✨
        </div>
        <p className='muted-foreground text-xs leading-relaxed'>
          Every act of kindness moves you closer to a more compassionate world. Keep going!
        </p>
      </div>
    </CardSection>
  )
}
