import { AuthProviderError } from '@/hooks/auth/auth-provider-errors'
import { t } from '@/lib/i18n'
import type { ApiResponse } from '@/types/api'

type DeleteAccountFlowDependencies = {
  deleteCurrentFirebaseUser: () => Promise<void>
  unsubscribeFromPushNotifications: () => Promise<void>
  deleteMe: () => Promise<ApiResponse<boolean>>
  logout: () => void
  navigateToLogin: () => void
  toastSuccess: (message: string) => void
  toastError: (message: string) => void
}

export const executeDeleteAccountFlow = async ({
  deleteCurrentFirebaseUser,
  unsubscribeFromPushNotifications,
  deleteMe,
  logout,
  navigateToLogin,
  toastSuccess,
  toastError,
}: DeleteAccountFlowDependencies): Promise<boolean> => {
  try {
    await deleteCurrentFirebaseUser()
  } catch (error) {
    if (error instanceof AuthProviderError && error.code === 'requires-recent-login') {
      toastError(t('settings.deleteAccount.errors.requiresRecentLogin'))

      return false
    }

    if (error instanceof AuthProviderError && error.code === 'no-firebase-session') {
      // Continue deleting backend account. Firebase user may already be removed.
    } else {
      toastError(t('settings.deleteAccount.errors.firebaseDeleteFailed'))

      return false
    }
  }

  try {
    await unsubscribeFromPushNotifications()
  } catch {
    // Best-effort browser push cleanup.
  }

  try {
    const response = await deleteMe()
    if (!response.success) {
      toastError(t('settings.deleteAccount.errors.backendDeleteFailed'))

      return false
    }
  } catch {
    toastError(t('settings.deleteAccount.errors.backendDeleteFailed'))

    return false
  }

  logout()
  toastSuccess(t('settings.deleteAccount.messages.deleted'))
  navigateToLogin()

  return true
}
