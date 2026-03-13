import type { UserDTO } from '@/types/api'

import { useNotificationSettingsActions } from './use-notification-settings-actions'
import { useNotificationSettingsState } from './use-notification-settings-state'

export const useNotificationSettings = (user?: UserDTO | null) => {
  const state = useNotificationSettingsState(user)
  const status = useNotificationSettingsActions({
    user,
    reminderTime: state.reminderTime,
    setReminderTime: state.setReminderTime,
    setPushError: state.setPushError,
  })

  return {
    ui: {
      reminderTime: state.reminderTime,
      pushSupported: state.pushSupported,
      pushError: state.pushError,
    },
    status: {
      isToggleLoading: status.isToggleLoading,
      isTestLoading: status.isTestLoading,
    },
    actions: {
      setReminderTime: state.setReminderTime,
      handleReminderToggle: status.handleReminderToggle,
      handleReminderTimeBlur: status.handleReminderTimeBlur,
      handleTestNotification: status.handleTestNotification,
    },
  }
}
