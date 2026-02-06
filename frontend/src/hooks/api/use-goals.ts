import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getGoalHistory, getGoals, upsertGoals } from '../../api/goals'
import type { GetGoalHistoryRequest, UpsertGoalsRequest } from '../../types/api'

export const GOAL_KEYS = {
  all: ['goals'] as const,
  list: () => [...GOAL_KEYS.all, 'list'] as const,
  history: (params?: GetGoalHistoryRequest) => [...GOAL_KEYS.all, 'history', params] as const,
}

export const useGoals = () => {
  return useQuery({
    queryKey: GOAL_KEYS.list(),
    queryFn: getGoals,
  })
}

export const useUpsertGoals = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpsertGoalsRequest) => upsertGoals(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GOAL_KEYS.all })
    },
  })
}

export const useGoalHistory = (params?: GetGoalHistoryRequest) => {
  return useQuery({
    queryKey: GOAL_KEYS.history(params),
    queryFn: () => getGoalHistory(params),
    placeholderData: (previousData) => previousData,
  })
}
