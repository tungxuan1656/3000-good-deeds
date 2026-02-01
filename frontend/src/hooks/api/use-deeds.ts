import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createDeed, deleteDeed, getDeeds } from '../../api/deeds'
import type { GetDeedsRequest } from '../../types/api'

export const DEED_KEYS = {
  all: ['deeds'] as const,
  list: (params: GetDeedsRequest) => [...DEED_KEYS.all, 'list', params] as const,
}

export const useDeeds = (params: GetDeedsRequest = {}) => {
  return useQuery({
    queryKey: DEED_KEYS.list(params),
    queryFn: () => getDeeds(params),
    placeholderData: (previousData) => previousData,
  })
}

export const useCreateDeed = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDeed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEED_KEYS.all })
    },
  })
}

export const useDeleteDeed = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDeed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEED_KEYS.all })
    },
  })
}
