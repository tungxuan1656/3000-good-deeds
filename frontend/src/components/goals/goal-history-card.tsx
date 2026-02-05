import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getGoalHistory, getGoals } from '@/api/goals'
import type { GoalHistoryDTO } from '@/types/api'

import { GoalHistoryItem } from './goal-history-item'

const GoalHistoryCard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [historyGoals, setHistoryGoals] = useState<GoalHistoryDTO[]>([])

  const loadHistory = async () => {
    setIsLoading(true)

    try {
      const goalsResponse = await getGoals()
      if (!goalsResponse.success || !goalsResponse.data) {
        throw new Error('Không thể tải mục tiêu')
      }

      const goals = goalsResponse.data
      if (goals.length === 0) {
        setHistoryGoals([])

        return
      }

      const historyResponses = await Promise.all(
        goals.map((goal) => getGoalHistory(goal.id, { limit: 20 })),
      )

      const histories = historyResponses
        .filter((res) => res.success && res.data)
        .flatMap((res) => res.data?.data ?? [])
        .sort((a, b) => b.startDate - a.startDate)

      setHistoryGoals(histories)
    } catch (error) {
      console.error(error)
      toast.error('Không thể tải lịch sử mục tiêu')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadHistory()
  }, [])

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
