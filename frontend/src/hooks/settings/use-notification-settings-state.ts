import { useEffect, useState } from 'react'

import { t } from '@/lib/i18n'
import { isPushSupported } from '@/lib/utils/push-notifications'
import type { UserDTO } from '@/types/api'

export const DEFAULT_REMINDER_TIME = '20:30'
export const TIME_INPUT_PATTERN = /^\d{2}:\d{2}$/

export const useNotificationSettingsState = (user?: UserDTO | null) => {
  const [reminderTime, setReminderTime] = useState(DEFAULT_REMINDER_TIME)
  const [pushSupported, setPushSupported] = useState(true)
  const [pushError, setPushError] = useState<string | null>(null)

  useEffect(() => {
    setPushSupported(isPushSupported())
  }, [])

  useEffect(() => {
    if (user) {
      setReminderTime(user.reminderTime ?? DEFAULT_REMINDER_TIME)
    }
  }, [user])

  useEffect(() => {
    if (!user?.reminderEnabled || !pushSupported) {
      setPushError(null)

      return
    }

    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
      setPushError(t('settings.notifications.errors.permissionNotGranted'))

      return
    }

    setPushError(null)
  }, [pushSupported, user?.reminderEnabled])

  return {
    reminderTime,
    setReminderTime,
    pushSupported,
    pushError,
    setPushError,
  }
}
