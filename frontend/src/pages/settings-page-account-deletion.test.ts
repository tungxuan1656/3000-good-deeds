import { describe, expect, it, vi } from 'vitest'

import { AuthProviderError } from '@/hooks/auth/auth-provider-errors'
import type { ApiResponse } from '@/types/api'

import { executeDeleteAccountFlow } from './settings-page-account-deletion'

const createTranslator = () => {
  const dictionary: Record<string, string> = {
    'settings.deleteAccount.errors.requiresRecentLogin': 'requires-recent-login',
    'settings.deleteAccount.errors.firebaseDeleteFailed': 'firebase-delete-failed',
    'settings.deleteAccount.errors.backendDeleteFailed': 'backend-delete-failed',
    'settings.deleteAccount.messages.deleted': 'deleted',
  }

  return (key: string) => dictionary[key] ?? key
}

describe('executeDeleteAccountFlow', () => {
  it('completes delete flow and redirects on success', async () => {
    const deleteCurrentFirebaseUser = vi.fn().mockResolvedValue(undefined)
    const unsubscribeFromPushNotifications = vi.fn().mockResolvedValue(undefined)
    const deleteMe = vi.fn<() => Promise<ApiResponse<boolean>>>().mockResolvedValue({
      success: true,
      data: true,
      error: null,
    })
    const logout = vi.fn()
    const navigateToLogin = vi.fn()
    const toastSuccess = vi.fn()
    const toastError = vi.fn()

    const completed = await executeDeleteAccountFlow({
      deleteCurrentFirebaseUser,
      unsubscribeFromPushNotifications,
      deleteMe,
      logout,
      navigateToLogin,
      toastSuccess,
      toastError,
      t: createTranslator(),
    })

    expect(completed).toBe(true)
    expect(deleteCurrentFirebaseUser).toHaveBeenCalledTimes(1)
    expect(deleteMe).toHaveBeenCalledTimes(1)
    expect(logout).toHaveBeenCalledTimes(1)
    expect(navigateToLogin).toHaveBeenCalledTimes(1)
    expect(toastSuccess).toHaveBeenCalledWith('deleted')
    expect(toastError).not.toHaveBeenCalled()
  })

  it('stops flow when Firebase requires recent login', async () => {
    const deleteCurrentFirebaseUser = vi
      .fn()
      .mockRejectedValue(
        new AuthProviderError('requires-recent-login', 'auth/requires-recent-login'),
      )
    const unsubscribeFromPushNotifications = vi.fn().mockResolvedValue(undefined)
    const deleteMe = vi.fn<() => Promise<ApiResponse<boolean>>>()
    const logout = vi.fn()
    const navigateToLogin = vi.fn()
    const toastSuccess = vi.fn()
    const toastError = vi.fn()

    const completed = await executeDeleteAccountFlow({
      deleteCurrentFirebaseUser,
      unsubscribeFromPushNotifications,
      deleteMe,
      logout,
      navigateToLogin,
      toastSuccess,
      toastError,
      t: createTranslator(),
    })

    expect(completed).toBe(false)
    expect(deleteMe).not.toHaveBeenCalled()
    expect(logout).not.toHaveBeenCalled()
    expect(navigateToLogin).not.toHaveBeenCalled()
    expect(toastError).toHaveBeenCalledWith('requires-recent-login')
  })

  it('continues backend deletion when Firebase session is already missing', async () => {
    const deleteCurrentFirebaseUser = vi
      .fn()
      .mockRejectedValue(new AuthProviderError('no-firebase-session', 'no-firebase-session'))
    const unsubscribeFromPushNotifications = vi.fn().mockResolvedValue(undefined)
    const deleteMe = vi.fn<() => Promise<ApiResponse<boolean>>>().mockResolvedValue({
      success: true,
      data: true,
      error: null,
    })
    const logout = vi.fn()
    const navigateToLogin = vi.fn()
    const toastSuccess = vi.fn()
    const toastError = vi.fn()

    const completed = await executeDeleteAccountFlow({
      deleteCurrentFirebaseUser,
      unsubscribeFromPushNotifications,
      deleteMe,
      logout,
      navigateToLogin,
      toastSuccess,
      toastError,
      t: createTranslator(),
    })

    expect(completed).toBe(true)
    expect(deleteMe).toHaveBeenCalledTimes(1)
    expect(logout).toHaveBeenCalledTimes(1)
    expect(navigateToLogin).toHaveBeenCalledTimes(1)
  })

  it('allows retry after backend failure even when Firebase session is gone', async () => {
    const deleteCurrentFirebaseUser = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new AuthProviderError('no-firebase-session', 'no-firebase-session'))
    const unsubscribeFromPushNotifications = vi.fn().mockResolvedValue(undefined)
    const deleteMe = vi
      .fn<() => Promise<ApiResponse<boolean>>>()
      .mockResolvedValueOnce({
        success: false,
        data: false,
        error: 'backend-failure',
      })
      .mockResolvedValueOnce({
        success: true,
        data: true,
        error: null,
      })
    const logout = vi.fn()
    const navigateToLogin = vi.fn()
    const toastSuccess = vi.fn()
    const toastError = vi.fn()

    const firstAttempt = await executeDeleteAccountFlow({
      deleteCurrentFirebaseUser,
      unsubscribeFromPushNotifications,
      deleteMe,
      logout,
      navigateToLogin,
      toastSuccess,
      toastError,
      t: createTranslator(),
    })

    const secondAttempt = await executeDeleteAccountFlow({
      deleteCurrentFirebaseUser,
      unsubscribeFromPushNotifications,
      deleteMe,
      logout,
      navigateToLogin,
      toastSuccess,
      toastError,
      t: createTranslator(),
    })

    expect(firstAttempt).toBe(false)
    expect(secondAttempt).toBe(true)
    expect(deleteMe).toHaveBeenCalledTimes(2)
    expect(logout).toHaveBeenCalledTimes(1)
    expect(navigateToLogin).toHaveBeenCalledTimes(1)
    expect(toastError).toHaveBeenCalledWith('backend-delete-failed')
    expect(toastSuccess).toHaveBeenCalledWith('deleted')
  })
})
