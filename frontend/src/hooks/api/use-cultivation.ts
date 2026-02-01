import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createJournal, getDailyQuote, getJournal, getRandomAct } from '../../api/cultivation'
import type { GetJournalRequest } from '../../types/api'

export const CULTIVATION_KEYS = {
  quote: ['cultivation', 'quote'] as const,
  act: ['cultivation', 'act'] as const,
  journal: (params: GetJournalRequest) => ['cultivation', 'journal', params] as const,
}

export const useDailyQuote = () => {
  return useQuery({
    queryKey: CULTIVATION_KEYS.quote,
    queryFn: getDailyQuote,
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

export const useRandomAct = () => {
  return useQuery({
    queryKey: CULTIVATION_KEYS.act,
    queryFn: getRandomAct,
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: false,
  })
}

export const useJournal = (params: GetJournalRequest = {}) => {
  return useQuery({
    queryKey: CULTIVATION_KEYS.journal(params),
    queryFn: () => getJournal(params),
  })
}

export const useCreateJournal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createJournal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cultivation', 'journal'] })
    },
  })
}
