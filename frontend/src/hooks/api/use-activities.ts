import { useQuery } from '@tanstack/react-query'

import { getWeeklyRhythm } from '../../api/activities'

export const ACTIVITIES_KEYS = {
  weeklyRhythm: (from?: number, to?: number) => ['activities', 'weekly-rhythm', from, to] as const,
}

const ONE_HOUR = 1000

export const useWeeklyRhythm = (from?: number, to?: number) => {
  return useQuery({
    queryKey: ACTIVITIES_KEYS.weeklyRhythm(from, to),
    queryFn: () => getWeeklyRhythm(from, to),
    staleTime: ONE_HOUR,
    gcTime: ONE_HOUR,
  })
}
