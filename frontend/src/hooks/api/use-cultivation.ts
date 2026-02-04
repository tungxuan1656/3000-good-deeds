import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createJournal,
  getJournal,
  getRandomAct,
  getRandomActs,
  getRandomQuote,
} from '../../api/cultivation'
import type { GetJournalRequest } from '../../types/api'

export const CULTIVATION_KEYS = {
  quote: ['cultivation', 'quote'] as const,
  act: ['cultivation', 'act'] as const,
  acts: (limit: number) => ['cultivation', 'acts', limit] as const,
  journal: (params: GetJournalRequest) => ['cultivation', 'journal', params] as const,
}

const SIX_HOURS = 1000 * 60 * 60 * 6

export const useRandomQuote = () => {
  return useQuery({
    queryKey: CULTIVATION_KEYS.quote,
    queryFn: getRandomQuote,
    staleTime: SIX_HOURS,
    gcTime: SIX_HOURS,
  })
}

export const useRandomAct = () => {
  return useQuery({
    queryKey: CULTIVATION_KEYS.act,
    queryFn: getRandomAct,
    staleTime: SIX_HOURS,
    gcTime: SIX_HOURS,
    enabled: false,
  })
}

export const useRandomActs = (limit = 10, enabled = true) => {
  return useQuery({
    queryKey: CULTIVATION_KEYS.acts(limit),
    queryFn: () => getRandomActs(limit),
    staleTime: SIX_HOURS,
    gcTime: SIX_HOURS,
    enabled,
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
