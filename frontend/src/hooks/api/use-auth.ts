import { useMutation, useQueryClient } from '@tanstack/react-query'

import { loginGoogle } from '../../api/auth'
import type { LoginRequest } from '../../types/api'

export const useLoginGoogle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoginRequest) => loginGoogle(data),
    onSuccess: () => {
      // Invalidate all queries so fresh data is fetched with the new user's session
      void queryClient.invalidateQueries()
    },
  })
}
