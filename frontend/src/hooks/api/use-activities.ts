import { useQuery } from '@tanstack/react-query'

import { getCalendar } from '../../api/activities'

export const ACTIVITIES_KEYS = {
  all: ['activities'] as const,
  all_calendar: ['activities', 'calendar'] as const,
  calendar: (from?: string, to?: string) =>
    ['activities', 'calendar', from, to] as const,
}

const ONE_HOUR = 1000 * 60 * 60

export const useCalendar = (from?: string, to?: string) => {
  return useQuery({
    queryKey: ACTIVITIES_KEYS.calendar(from, to),
    queryFn: () => getCalendar(from, to),
    staleTime: ONE_HOUR,
    gcTime: ONE_HOUR,
  })
}
