import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  createJournalEntry,
  deleteJournalEntry,
  getJournalEntriesPaged,
  getJournalEntryDetail,
} from '@/api/inner-journal'
import type {
  CreateJournalRequest,
  GetJournalEntriesRequest,
} from '@/types/api'

export const INNER_JOURNAL_KEYS = {
  all: ['inner-journal'] as const,
  list: (params: Omit<GetJournalEntriesRequest, 'cursor'>) =>
    [...INNER_JOURNAL_KEYS.all, 'list', params] as const,
  detail: (id: string) => [...INNER_JOURNAL_KEYS.all, 'detail', id] as const,
}

export const useInnerJournalEntries = (
  params: Omit<GetJournalEntriesRequest, 'cursor'> = {},
) => {
  return useInfiniteQuery({
    queryKey: INNER_JOURNAL_KEYS.list(params),
    queryFn: ({ pageParam }) =>
      getJournalEntriesPaged({ ...params, cursor: pageParam }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.success || !lastPage.data) return undefined

      const { pagination } = lastPage.data

      return pagination.hasMore
        ? (pagination.nextCursor ?? undefined)
        : undefined
    },
    initialPageParam: undefined as string | undefined,
  })
}

export const useInnerJournalEntry = (id: string) => {
  return useQuery({
    queryKey: INNER_JOURNAL_KEYS.detail(id),
    queryFn: () => getJournalEntryDetail(id),
    enabled: Boolean(id),
  })
}

export const useCreateInnerJournalEntry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateJournalRequest) => createJournalEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INNER_JOURNAL_KEYS.all })
    },
  })
}

export const useDeleteInnerJournalEntry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteJournalEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INNER_JOURNAL_KEYS.all })
    },
  })
}
