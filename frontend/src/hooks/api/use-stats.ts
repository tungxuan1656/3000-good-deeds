import { useQuery } from '@tanstack/react-query'

import { getStatsSummary } from '../../api/stats'

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
