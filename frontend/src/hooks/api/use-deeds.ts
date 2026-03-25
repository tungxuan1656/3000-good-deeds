import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import { createDeed, deleteDeed, getDeeds, updateDeed } from '../../api/deeds'
import type { GetDeedsRequest, UpdateDeedRequest } from '../../types/api'
import { ACTIVITIES_KEYS } from './use-activities'

export const DEED_KEYS = {
  all: ['deeds'] as const,
  list: (params: Omit<GetDeedsRequest, 'cursor'>) =>
    [...DEED_KEYS.all, 'list', params] as const,
}

export const useDeeds = (params: Omit<GetDeedsRequest, 'cursor'> = {}) => {
  return useInfiniteQuery({
    queryKey: DEED_KEYS.list(params),
    queryFn: ({ pageParam }) => getDeeds({ ...params, cursor: pageParam }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.success || !lastPage.data) return undefined

      const { pagination } = lastPage.data

      return pagination.hasMore ? pagination.nextCursor : undefined
    },
    initialPageParam: undefined as string | undefined,
  })
}

export const useCreateDeed = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDeed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEED_KEYS.all })
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_KEYS.all_calendar })
    },
  })
}

export const useUpdateDeed = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDeedRequest }) =>
      updateDeed(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEED_KEYS.all })
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_KEYS.all_calendar })
    },
  })
}

export const useDeleteDeed = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDeed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEED_KEYS.all })
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_KEYS.all_calendar })
    },
  })
}
