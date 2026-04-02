import { CheckCircle2Icon, XCircleIcon } from 'lucide-react'

import { InfoButton } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { useNotificationSettings } from '@/hooks/settings'
import { INFO_COPY } from '@/lib/constants/info-copy'
import { t } from '@/lib/i18n'
import type { UserDTO } from '@/types/api'

import { Card } from '../ui'

interface NotificationSettingsCardProps {
  user?: UserDTO | null
}

export const NotificationSettingsCard = ({
  user,
}: NotificationSettingsCardProps) => {
  const { ui, status, actions } = useNotificationSettings(user)

  return (
    <Card className='flex flex-col gap-2' padding='sm'>
      <div>
        <div className='flex items-center gap-2'>
          <h4 className='text-foreground text-base font-semibold md:text-xl'>
            {t('settings.notifications.title')}
          </h4>
          <InfoButton
            description={INFO_COPY.reminders.description}
            title={INFO_COPY.reminders.title}
          />
        </div>
        <p className='text-muted-foreground text-sm'>
          {t('settings.notifications.subtitle')}
        </p>
      </div>
      {user?.reminderEnabled && (
        <div className='flex items-center justify-between gap-4'>
          <div className='flex flex-col gap-0.5'>
            <span className='text-primary text-xss flex items-center md:text-xs'>
              {user?.reminderEnabled ? (
                <CheckCircle2Icon className='inline size-3' />
              ) : (
                <XCircleIcon className='inline size-3' />
              )}
              <span className='ml-1'>
                {user?.reminderEnabled
                  ? t('settings.notifications.status.enabled')
                  : t('settings.notifications.status.disabled')}
              </span>
            </span>
            <Label className='text-foreground text-xs font-semibold tracking-widest uppercase'>
              {t('settings.notifications.reminderTimeLabel')}
            </Label>
          </div>
          <Input
            className='border-border bg-card h-auto w-36 rounded-2xl border px-4 py-2 text-sm'
            type='time'
            value={ui.reminderTime}
            onBlur={actions.handleReminderTimeBlur}
            onChange={(event) => actions.setReminderTime(event.target.value)}
          />
        </div>
      )}
      {!ui.pushSupported && (
        <p className='text-muted-foreground mt-1 text-sm'>
          {t('settings.notifications.unsupportedHint')}
        </p>
      )}
      {ui.pushError && (
        <p className='text-destructive mt-1 text-sm'>{ui.pushError}</p>
      )}
      <div className='flex gap-2'>
        <Button
          className='flex-2'
          disabled={
            status.isToggleLoading ||
            (!ui.pushSupported && !user?.reminderEnabled)
          }
          size={'sm'}
          variant={user?.reminderEnabled ? 'secondary' : 'default'}
          onClick={() => actions.handleReminderToggle(!user?.reminderEnabled)}>
          {status.isToggleLoading ? <Spinner /> : null}
          {user?.reminderEnabled
            ? t('settings.notifications.actions.disable')
            : t('settings.notifications.actions.enable')}
        </Button>
        {user?.reminderEnabled ? (
          <Button
            className='flex-1'
            disabled={
              status.isTestLoading ||
              status.isToggleLoading ||
              !ui.pushSupported
            }
            size='sm'
            variant='outline'
            onClick={actions.handleTestNotification}>
            {status.isTestLoading ? <Spinner /> : null}
            {t('settings.notifications.actions.sendTest')}
          </Button>
        ) : null}
      </div>
    </Card>
  )
}
