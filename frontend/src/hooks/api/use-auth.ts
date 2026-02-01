import { useMutation } from '@tanstack/react-query'

import { loginGoogle } from '../../api/auth'
import type { LoginRequest } from '../../types/api'

export const useLoginGoogle = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => loginGoogle(data),
  })
}
