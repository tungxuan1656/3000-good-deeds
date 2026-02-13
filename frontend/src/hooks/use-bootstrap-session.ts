import { useCallback, useEffect } from 'react'

import { restoreSession } from '@/api/auth'
import { authActions, useAuthStore } from '@/stores/auth-store'

export const useBootstrapSession = () => {
  const isSessionChecked = useAuthStore.use.isSessionChecked()
  const accessToken = useAuthStore.use.accessToken()

  const bootstrapSession = useCallback(async () => {
    try {
      const response = await restoreSession()
      if (response.success && response.data) {
        authActions.restoreSession(response.data)

        return
      }
    } catch {
      // Ignore: unauthenticated users should continue to login page.
    }

    authActions.markSessionChecked(true)
  }, [])

  useEffect(() => {
    if (isSessionChecked) {
      return
    }

    if (accessToken) {
      authActions.markSessionChecked(true)

      return
    }

    void bootstrapSession()
  }, [accessToken, isSessionChecked, bootstrapSession])

  return null
}
