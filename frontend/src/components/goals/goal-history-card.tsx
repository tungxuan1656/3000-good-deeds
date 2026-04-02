import { LeafIcon } from 'lucide-react'

import { useGoalHistory } from '@/hooks/api/use-goals'
import { t } from '@/lib/i18n'

import { EmptyDataView } from '../shared/empty-data-view'
import { SkeletonList } from '../shared/skeleton-list'
import { GoalHistoryItem } from './goal-history-item'

export const GoalHistoryCard = () => {
  const { data: historyResponse, isLoading } = useGoalHistory({ limit: 20 })

  const historyGoals = historyResponse?.success
    ? (historyResponse.data?.data ?? [])
    : []

  return (
    <div className='flex flex-col gap-2'>
      <h3 className='font-headline text-primary px-2 text-lg italic md:text-xl'>
        {t('goals.history.title')}
      </h3>
      {isLoading && <SkeletonList length={1} />}

      {!isLoading && historyGoals.length === 0 && (
        <EmptyDataView
          Icon={<LeafIcon />}
          description={t('goals.history.emptyDescription')}
          title={t('goals.history.emptyTitle')}
        />
      )}

      {!isLoading && historyGoals.length > 0 && (
        <div className='flex flex-col gap-3'>
          {historyGoals.map((goal) => (
            <GoalHistoryItem key={goal.id} goalHistory={goal} />
          ))}
        </div>
      )}
    </div>
  )
}
