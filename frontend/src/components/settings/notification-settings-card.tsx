import { CheckCircle2Icon, XCircleIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { testPushNotification } from '@/api/reminders'
import { CardSection, InfoButton } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { useUpdateUser } from '@/hooks/api/use-user'
import { t } from '@/lib/i18n'
import { INFO_COPY } from '@/lib/info-copy'
import {
  isPushSupported,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
} from '@/lib/push-notifications'
import { authActions } from '@/stores/auth-store'
import type { UserDTO } from '@/types/api'

interface NotificationSettingsCardProps {
  user?: UserDTO | null
}

const NotificationSettingsCard = ({ user }: NotificationSettingsCardProps) => {
  const updateUser = useUpdateUser()
  const [reminderTime, setReminderTime] = useState('20:30')
  const [pushSupported, setPushSupported] = useState(true)
  const [pushError, setPushError] = useState<string | null>(null)
  const [isToggleLoading, setIsToggleLoading] = useState(false)
  const [isTestLoading, setIsTestLoading] = useState(false)

  useEffect(() => {
    setPushSupported(isPushSupported())
  }, [])

  useEffect(() => {
    if (user) {
      setReminderTime(user.reminderTime ?? '20:30')
    }
  }, [user])

  useEffect(() => {
    if (!user?.reminderEnabled || !pushSupported) {
      setPushError(null)

      return
    }

    if (Notification.permission !== 'granted') {
      setPushError(t('settings.notifications.errors.permissionNotGranted'))

      return
    }

    setPushError(null)
  }, [pushSupported, user?.reminderEnabled])

  const handleReminderToggle = async (nextValue: boolean) => {
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

      const response = await updateUser.mutateAsync({
        reminderEnabled: nextValue,
      })
      if (response?.data) {
        authActions.setUser(response.data)
      }
    } catch (error) {
      console.log(error)
      setPushError(t('settings.notifications.errors.updateFailed'))
    } finally {
      setIsToggleLoading(false)
    }
  }

  const handleReminderTimeBlur = async () => {
    try {
      if (!reminderTime.match(/^\d{2}:\d{2}$/)) {
        setReminderTime(user?.reminderTime ?? '20:30')

        return
      }
      if (reminderTime === user?.reminderTime) return

      const response = await updateUser.mutateAsync({
        reminderTime,
      })
      if (response?.data) {
        authActions.setUser(response.data)
      }
    } catch {
      // Keep local value; backend validation will show on next successful fetch
    }
  }

  const handleTestNotification = async () => {
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
      console.log(error)

      const message = t('settings.notifications.errors.testSendRetry')
      setPushError(message)
      toast.error(message)
    } finally {
      setIsTestLoading(false)
    }
  }

  return (
    <CardSection className='gap-4'>
      <div className='flex items-center justify-between'>
        <div>
          <div className='flex items-center gap-2 text-xs font-semibold tracking-widest uppercase'>
            {user?.reminderEnabled ? (
              <span className='flex items-center text-emerald-600'>
                <CheckCircle2Icon className='inline h-4 w-4' />
                <span className='ml-1'>{t('settings.notifications.status.enabled')}</span>
              </span>
            ) : (
              <span className='text-muted-foreground flex items-center'>
                <XCircleIcon className='inline h-4 w-4' />
                <span className='ml-1'>{t('settings.notifications.status.disabled')}</span>
              </span>
            )}
          </div>
          <div className='flex items-center gap-2'>
            <p className='text-foreground text-base font-semibold'>
              {t('settings.notifications.title')}
            </p>
            <InfoButton
              description={INFO_COPY.reminders.description}
              title={INFO_COPY.reminders.title}
            />
          </div>
          <p className='text-muted-foreground mt-1 text-sm'>
            {t('settings.notifications.subtitle')}
          </p>
          {!pushSupported && (
            <p className='text-muted-foreground mt-1 text-sm'>
              {t('settings.notifications.unsupportedHint')}
            </p>
          )}
          {pushError && <p className='mt-1 text-sm text-red-600'>{pushError}</p>}
        </div>
        <Button
          disabled={isToggleLoading || (!pushSupported && !user?.reminderEnabled)}
          variant={user?.reminderEnabled ? 'outline' : 'default'}
          onClick={() => handleReminderToggle(!user?.reminderEnabled)}>
          {isToggleLoading ? <Spinner /> : null}
          {user?.reminderEnabled
            ? t('settings.notifications.actions.disable')
            : t('settings.notifications.actions.enable')}
        </Button>
      </div>
      {user?.reminderEnabled && (
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between gap-4'>
            <Label className='text-foreground text-xs font-semibold tracking-widest uppercase'>
              {t('settings.notifications.reminderTimeLabel')}
            </Label>
            <Input
              className='w-36 rounded-2xl border border-black/5 bg-white px-4 py-2 text-sm'
              type='time'
              value={reminderTime}
              onBlur={handleReminderTimeBlur}
              onChange={(event) => setReminderTime(event.target.value)}
            />
          </div>
          <p className='text-muted-foreground text-sm'>
            {t('settings.notifications.reminderBehavior')}
          </p>
          <p className='text-muted-foreground text-sm'>
            {t('settings.notifications.sampleMessage')}
          </p>
          <div className='flex justify-end'>
            <Button
              disabled={isTestLoading || isToggleLoading || !pushSupported}
              size='sm'
              variant='outline'
              onClick={handleTestNotification}>
              {isTestLoading ? <Spinner /> : null}
              {t('settings.notifications.actions.sendTest')}
            </Button>
          </div>
        </div>
      )}
    </CardSection>
  )
}

export default NotificationSettingsCard
