import { CheckCircle2Icon, XCircleIcon } from 'lucide-react'

import { CardSection, InfoButton } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { useNotificationSettings } from '@/hooks/settings'
import { INFO_COPY } from '@/lib/constants/info-copy'
import { t } from '@/lib/i18n'
import type { UserDTO } from '@/types/api'

interface NotificationSettingsCardProps {
  user?: UserDTO | null
}

export const NotificationSettingsCard = ({ user }: NotificationSettingsCardProps) => {
  const { ui, status, actions } = useNotificationSettings(user)

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
          {!ui.pushSupported && (
            <p className='text-muted-foreground mt-1 text-sm'>
              {t('settings.notifications.unsupportedHint')}
            </p>
          )}
          {ui.pushError && <p className='mt-1 text-sm text-red-600'>{ui.pushError}</p>}
        </div>
        <Button
          disabled={status.isToggleLoading || (!ui.pushSupported && !user?.reminderEnabled)}
          variant={user?.reminderEnabled ? 'outline' : 'default'}
          onClick={() => actions.handleReminderToggle(!user?.reminderEnabled)}>
          {status.isToggleLoading ? <Spinner /> : null}
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
              value={ui.reminderTime}
              onBlur={actions.handleReminderTimeBlur}
              onChange={(event) => actions.setReminderTime(event.target.value)}
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
              disabled={status.isTestLoading || status.isToggleLoading || !ui.pushSupported}
              size='sm'
              variant='outline'
              onClick={actions.handleTestNotification}>
              {status.isTestLoading ? <Spinner /> : null}
              {t('settings.notifications.actions.sendTest')}
            </Button>
          </div>
        </div>
      )}
    </CardSection>
  )
}
