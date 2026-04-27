import { describe, expect, it, vi } from 'vitest'

import { AuthProviderError } from '@/hooks/auth/auth-provider-errors'
import { t } from '@/lib/i18n'
import type { ApiResponse } from '@/types/api'

import { executeDeleteAccountFlow } from './settings-page-account-deletion'

describe('executeDeleteAccountFlow', () => {
  it('completes delete flow and redirects on success', async () => {
    const deleteCurrentFirebaseUser = vi.fn().mockResolvedValue(undefined)
    const unsubscribeFromPushNotifications = vi
      .fn()
      .mockResolvedValue(undefined)
    const deleteMe = vi
      .fn<() => Promise<ApiResponse<boolean>>>()
      .mockResolvedValue({
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
    })

    expect(completed).toBe(true)
    expect(deleteCurrentFirebaseUser).toHaveBeenCalledTimes(1)
    expect(deleteMe).toHaveBeenCalledTimes(1)
    expect(logout).toHaveBeenCalledTimes(1)
    expect(navigateToLogin).toHaveBeenCalledTimes(1)

    expect(toastSuccess).toHaveBeenCalledWith(
      t('settings.deleteAccount.messages.deleted'),
    )

    expect(toastError).not.toHaveBeenCalled()
  })

  it('stops flow when Firebase requires recent login', async () => {
    const deleteCurrentFirebaseUser = vi
      .fn()
      .mockRejectedValue(
        new AuthProviderError(
          'requires-recent-login',
          'auth/requires-recent-login',
        ),
      )
    const unsubscribeFromPushNotifications = vi
      .fn()
      .mockResolvedValue(undefined)
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
    })

    expect(completed).toBe(false)
    expect(deleteMe).not.toHaveBeenCalled()
    expect(logout).not.toHaveBeenCalled()
    expect(navigateToLogin).not.toHaveBeenCalled()

    expect(toastError).toHaveBeenCalledWith(
      t('settings.deleteAccount.errors.requiresRecentLogin'),
    )
  })

  it('continues backend deletion when Firebase session is already missing', async () => {
    const deleteCurrentFirebaseUser = vi
      .fn()
      .mockRejectedValue(
        new AuthProviderError('no-firebase-session', 'no-firebase-session'),
      )
    const unsubscribeFromPushNotifications = vi
      .fn()
      .mockResolvedValue(undefined)
    const deleteMe = vi
      .fn<() => Promise<ApiResponse<boolean>>>()
      .mockResolvedValue({
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
      .mockRejectedValueOnce(
        new AuthProviderError('no-firebase-session', 'no-firebase-session'),
      )
    const unsubscribeFromPushNotifications = vi
      .fn()
      .mockResolvedValue(undefined)
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
    })

    const secondAttempt = await executeDeleteAccountFlow({
      deleteCurrentFirebaseUser,
      unsubscribeFromPushNotifications,
      deleteMe,
      logout,
      navigateToLogin,
      toastSuccess,
      toastError,
    })

    expect(firstAttempt).toBe(false)
    expect(secondAttempt).toBe(true)
    expect(deleteMe).toHaveBeenCalledTimes(2)
    expect(logout).toHaveBeenCalledTimes(1)
    expect(navigateToLogin).toHaveBeenCalledTimes(1)

    expect(toastError).toHaveBeenCalledWith(
      t('settings.deleteAccount.errors.backendDeleteFailed'),
    )

    expect(toastSuccess).toHaveBeenCalledWith(
      t('settings.deleteAccount.messages.deleted'),
    )
  })
})
