import { useGoalHistory } from '@/hooks/api/use-goals'

import { GoalHistoryItem } from './goal-history-item'

const GoalHistoryCard = () => {
  const { data: historyResponse, isLoading } = useGoalHistory({ limit: 20 })

  const historyGoals = historyResponse?.success ? (historyResponse.data?.data ?? []) : []

  return (
    <div className='gap-4'>
      <p className='text-foreground mb-2 text-base font-semibold'>Lịch sử mục tiêu</p>
      {isLoading && (
        <div className='flex flex-col gap-3'>
          {[1, 2, 3].map((item) => (
            <div key={item} className='rounded-2xl border border-black/5 bg-white/80 p-4 shadow-sm'>
              <div className='bg-muted mb-2 h-3 w-32 animate-pulse rounded-full' />
              <div className='bg-muted h-12 w-full animate-pulse rounded-2xl' />
            </div>
          ))}
        </div>
      )}

      {!isLoading && historyGoals.length === 0 && (
        <p className='text-muted-foreground text-sm'>Bạn chưa có lịch sử mục tiêu.</p>
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

export default GoalHistoryCard
