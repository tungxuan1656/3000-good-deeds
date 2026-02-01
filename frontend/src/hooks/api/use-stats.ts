import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createGoal, getGoals, getStatsSummary } from '../../api/stats'

export const STATS_KEYS = {
  summary: ['stats', 'summary'] as const,
  goals: ['stats', 'goals'] as const,
}

export const useStatsSummary = () => {
  return useQuery({
    queryKey: STATS_KEYS.summary,
    queryFn: getStatsSummary,
  })
}

export const useGoals = () => {
  return useQuery({
    queryKey: STATS_KEYS.goals,
    queryFn: getGoals,
  })
}

export const useCreateGoal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STATS_KEYS.goals })
    },
  })
}
