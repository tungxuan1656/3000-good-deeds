import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getMe, updateMe } from '../../api/user'
import type { UserDTO } from '../../types/api'

export const USER_KEYS = {
  me: ['user', 'me'] as const,
}

export const useUser = () => {
  return useQuery({
    queryKey: USER_KEYS.me,
    queryFn: getMe,
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<UserDTO>) => updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.me })
    },
  })
}
