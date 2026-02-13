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
      setPushError('Thiết bị này chưa được kích hoạt nhận nhắc nhở.')

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
          setPushError(result.error ?? 'Không thể bật nhắc nhở lúc này.')

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
      setPushError('Không thể cập nhật nhắc nhở. Vui lòng thử lại sau.')
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
        const message = response.error ?? 'Không thể gửi thông báo thử.'
        setPushError(message)
        toast.error(message)

        return
      }

      toast.success('Đã gửi thông báo thử. Vui lòng kiểm tra thiết bị.')
    } catch (error) {
      console.log(error)

      const message = 'Không thể gửi thông báo thử. Vui lòng thử lại sau.'
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
                <span className='ml-1'>Đang bật</span>
              </span>
            ) : (
              <span className='text-muted-foreground flex items-center'>
                <XCircleIcon className='inline h-4 w-4' />
                <span className='ml-1'>Đang tắt</span>
              </span>
            )}
          </div>
          <div className='flex items-center gap-2'>
            <p className='text-foreground text-base font-semibold'>Thông báo nhắc nhở</p>
            <InfoButton
              description={INFO_COPY.reminders.description}
              title={INFO_COPY.reminders.title}
            />
          </div>
          <p className='text-muted-foreground mt-1 text-sm'>Chỉ một lần mỗi ngày.</p>
          {!pushSupported && (
            <p className='text-muted-foreground mt-1 text-sm'>
              Thiết bị này chưa hỗ trợ Web Push hoặc cần cài đặt PWA (iOS Safari).
            </p>
          )}
          {pushError && <p className='mt-1 text-sm text-red-600'>{pushError}</p>}
        </div>
        <Button
          disabled={isToggleLoading || (!pushSupported && !user?.reminderEnabled)}
          variant={user?.reminderEnabled ? 'outline' : 'default'}
          onClick={() => handleReminderToggle(!user?.reminderEnabled)}>
          {isToggleLoading ? <Spinner /> : null}
          {user?.reminderEnabled ? 'Tắt thông báo' : 'Bật thông báo'}
        </Button>
      </div>
      {user?.reminderEnabled && (
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between gap-4'>
            <Label className='text-foreground text-xs font-semibold tracking-widest uppercase'>
              Chọn giờ nhắc
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
            Hệ thống sẽ bỏ qua nhắc nhở nếu bạn đã check-in trong ngày.
          </p>
          <p className='text-muted-foreground text-sm'>
            Thông báo mẫu: “Đến giờ ghi nhận việc thiện 🌱”.
          </p>
          <div className='flex justify-end'>
            <Button
              disabled={isTestLoading || isToggleLoading || !pushSupported}
              size='sm'
              variant='outline'
              onClick={handleTestNotification}>
              {isTestLoading ? <Spinner /> : null}
              Gửi thông báo thử
            </Button>
          </div>
        </div>
      )}
    </CardSection>
  )
}

export default NotificationSettingsCard
