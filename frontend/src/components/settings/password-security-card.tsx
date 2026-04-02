import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthProvider } from '@/hooks/auth/use-auth-provider'
import { firebaseAuth } from '@/lib/firebase'
import { t } from '@/lib/i18n'

import { Card } from '../ui'

export const PasswordSecurityCard = () => {
  const { changePasswordWithCurrent } = useAuthProvider()
  const [currentPassword, setCurrentPassword] = useState('')
  const [nextPassword, setNextPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const providerData = firebaseAuth.currentUser?.providerData ?? []
  const canChangePassword = providerData.some(
    (provider) => provider.providerId === 'password',
  )

  const resetForm = () => {
    setCurrentPassword('')
    setNextPassword('')
  }

  const handleChangePassword = async () => {
    if (!canChangePassword) {
      return
    }

    if (!currentPassword || !nextPassword) {
      toast.error(t('settings.security.errors.missingFields'))

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
    <Card padding='sm'>
      <h4 className='text-foreground text-base font-semibold md:text-xl'>
        {t('settings.security.title')}
      </h4>
      <p className='text-muted-foreground mt-1 text-sm'>
        {t('settings.security.description')}
      </p>

      {canChangePassword ? (
        <div className='mt-3 flex flex-col gap-2'>
          <Input
            className='h-9'
            placeholder={t('settings.security.fields.currentPassword')}
            type='password'
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
          <Input
            className='h-9'
            placeholder={t('settings.security.fields.newPassword')}
            type='password'
            value={nextPassword}
            onChange={(event) => setNextPassword(event.target.value)}
          />
          <Button
            disabled={isSubmitting}
            size={'sm'}
            onClick={handleChangePassword}>
            {isSubmitting
              ? t('common.actions.processing')
              : t('settings.security.actions.update')}
          </Button>
        </div>
      ) : (
        <div className='text-muted-foreground text-sm'>
          {t('settings.security.googleOnly')}
        </div>
      )}
    </Card>
  )
}
