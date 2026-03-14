import { KeyRoundIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { CardSection } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthProvider } from '@/hooks/auth/use-auth-provider'
import { firebaseAuth } from '@/lib/firebase'
import { t } from '@/lib/i18n'

export const PasswordSecurityCard = () => {
  const { changePasswordWithCurrent } = useAuthProvider()
  const [currentPassword, setCurrentPassword] = useState('')
  const [nextPassword, setNextPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const providerData = firebaseAuth.currentUser?.providerData ?? []
  const canChangePassword = providerData.some((provider) => provider.providerId === 'password')

  const resetForm = () => {
    setCurrentPassword('')
    setNextPassword('')
    setConfirmPassword('')
  }

  const handleChangePassword = async () => {
    if (!canChangePassword) {
      return
    }

    if (!currentPassword || !nextPassword || !confirmPassword) {
      toast.error(t('settings.security.errors.missingFields'))

      return
    }

    if (nextPassword !== confirmPassword) {
      toast.error(t('settings.security.errors.passwordMismatch'))

      return
    }

    if (nextPassword.length < 6) {
      toast.error(t('settings.security.errors.passwordTooShort'))

      return
    }

    try {
      setIsSubmitting(true)
      await changePasswordWithCurrent(currentPassword, nextPassword)
      resetForm()
      toast.success(t('settings.security.messages.passwordUpdated'))
    } catch {
      toast.error(t('settings.security.errors.updateFailed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CardSection className='gap-4'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <p className='text-foreground text-base font-semibold'>{t('settings.security.title')}</p>
          <p className='text-muted-foreground mt-1 text-sm'>{t('settings.security.description')}</p>
        </div>
        <div className='flex items-center justify-center rounded-full'>
          <KeyRoundIcon className='text-primary h-5 w-5' />
        </div>
      </div>

      {canChangePassword ? (
        <div className='flex flex-col gap-3'>
          <Input
            placeholder={t('settings.security.fields.currentPassword')}
            type='password'
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
          <Input
            placeholder={t('settings.security.fields.newPassword')}
            type='password'
            value={nextPassword}
            onChange={(event) => setNextPassword(event.target.value)}
          />
          <Input
            placeholder={t('settings.security.fields.confirmPassword')}
            type='password'
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          <Button className='h-11 w-full' disabled={isSubmitting} onClick={handleChangePassword}>
            {isSubmitting ? t('common.actions.processing') : t('settings.security.actions.update')}
          </Button>
        </div>
      ) : (
        <div className='text-muted-foreground text-sm'>{t('settings.security.googleOnly')}</div>
      )}
    </CardSection>
  )
}
