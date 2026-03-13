import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { testPushNotification } from '@/api/reminders'
import { useUpdateUser } from '@/hooks/api/use-user'
import { t } from '@/lib/i18n'
import {
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
} from '@/lib/utils/push-notifications'
import { authActions } from '@/stores/auth.store'
import type { UserDTO } from '@/types/api'

import { DEFAULT_REMINDER_TIME, TIME_INPUT_PATTERN } from './use-notification-settings-state'

type UseNotificationSettingsActionsParams = {
  user?: UserDTO | null
  reminderTime: string
  setReminderTime: (value: string) => void
  setPushError: (value: string | null) => void
}

type UpdateNotificationSettingsRequest = {
  reminderEnabled?: boolean
  reminderTime?: string
}

export const useNotificationSettingsActions = ({
  user,
  reminderTime,
  setReminderTime,
  setPushError,
}: UseNotificationSettingsActionsParams) => {
  const updateUser = useUpdateUser()
  const [isToggleLoading, setIsToggleLoading] = useState(false)
  const [isTestLoading, setIsTestLoading] = useState(false)

  const applyUserPatch = useCallback(
    async (payload: UpdateNotificationSettingsRequest) => {
      const response = await updateUser.mutateAsync(payload)
      if (response?.data) {
        authActions.setUser(response.data)

        return true
      }

      return false
    },
    [updateUser],
  )

  const handleReminderToggle = useCallback(
    async (nextValue: boolean) => {
      if (isToggleLoading) return

      try {
        setIsToggleLoading(true)
        setPushError(null)

        if (nextValue) {
          const result = await subscribeToPushNotifications()
          if (!result.success) {
            setPushError(result.error ?? t('settings.notifications.errors.enableFailed'))

            return
          }
        } else {
          await unsubscribeFromPushNotifications()
        }

        const isPatched = await applyUserPatch({
          reminderEnabled: nextValue,
        })
        if (!isPatched) {
          setPushError(t('settings.notifications.errors.updateFailed'))

          if (nextValue) {
            await unsubscribeFromPushNotifications()
          }
        }
      } catch (error) {
        console.error(error)
        setPushError(t('settings.notifications.errors.updateFailed'))

        if (nextValue) {
          try {
            await unsubscribeFromPushNotifications()
          } catch {
            // Ignore rollback error and surface the original update failure.
          }
        }
      } finally {
        setIsToggleLoading(false)
      }
    },
    [applyUserPatch, isToggleLoading, setPushError],
  )

  const handleReminderTimeBlur = useCallback(async () => {
    if (isToggleLoading) return

    try {
      if (!TIME_INPUT_PATTERN.test(reminderTime)) {
        setReminderTime(user?.reminderTime ?? DEFAULT_REMINDER_TIME)

        return
      }
      if (reminderTime === user?.reminderTime) return

      await applyUserPatch({
        reminderTime,
      })
    } catch {
      // Keep local value; backend validation will show on next successful fetch
    }
  }, [applyUserPatch, isToggleLoading, reminderTime, setReminderTime, user?.reminderTime])

  const handleTestNotification = useCallback(async () => {
    if (isTestLoading || isToggleLoading) return

    try {
      setIsTestLoading(true)
      setPushError(null)

      const response = await testPushNotification()
      if (!response.success) {
        const message = response.error ?? t('settings.notifications.errors.testSendFailed')
        setPushError(message)
        toast.error(message)

        return
      }

      toast.success(t('settings.notifications.messages.testSent'))
    } catch (error) {
      console.error(error)

      const message = t('settings.notifications.errors.testSendRetry')
      setPushError(message)
      toast.error(message)
    } finally {
      setIsTestLoading(false)
    }
  }, [isTestLoading, isToggleLoading, setPushError])

  return {
    isToggleLoading,
    isTestLoading,
    handleReminderToggle,
    handleReminderTimeBlur,
    handleTestNotification,
  }
}
