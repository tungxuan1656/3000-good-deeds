import { useMutation, useQueryClient } from '@tanstack/react-query'

import { exchangeProviderToken } from '../../api/auth'
import type { ProviderExchangeRequest } from '../../types/api'

export const useExchangeProviderToken = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ProviderExchangeRequest) => exchangeProviderToken(data),
    onSuccess: () => {
      // Invalidate all queries so fresh data is fetched with the new user's session
      void queryClient.invalidateQueries()
    },
  })
}
