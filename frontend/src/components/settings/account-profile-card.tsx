import { UserIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { CardSection } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUpdateUser } from '@/hooks/api/use-user'
import { useAuthProvider } from '@/hooks/auth/use-auth-provider'
import { t } from '@/lib/i18n'
import { authActions } from '@/stores/auth.store'
import type { UserDTO } from '@/types/api'

import { Label } from '../ui'

interface AccountProfileCardProps {
  user?: UserDTO | null
}

export const AccountProfileCard = ({ user }: AccountProfileCardProps) => {
  const [displayNameInput, setDisplayNameInput] = useState(user?.displayName ?? '')
  const updateUser = useUpdateUser()
  const { updateDisplayNameOnly } = useAuthProvider()

  useEffect(() => {
    setDisplayNameInput(user?.displayName ?? '')
  }, [user?.displayName])

  const displayName = user?.displayName ?? t('layout.user.fallbackName')
  const displayEmail = user?.email ?? t('layout.user.emailMissing')

  const hasChanged = displayNameInput.trim() !== (user?.displayName ?? '').trim()

  const handleUpdateDisplayName = async () => {
    const nextDisplayName = displayNameInput.trim()
    if (!nextDisplayName) {
      toast.error(t('settings.account.errors.emptyDisplayName'))

      return
    }

    try {
      await updateDisplayNameOnly(nextDisplayName)

      const response = await updateUser.mutateAsync({ displayName: nextDisplayName })

      if (response?.data) {
        authActions.setUser(response.data)
      }
      toast.success(t('settings.account.messages.updated'))
    } catch {
      toast.error(t('settings.account.errors.updateFailed'))
    }
  }

  return (
    <CardSection className='gap-4'>
      <div className='flex justify-between'>
        <div>
          <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
            {t('settings.account.heading')}
          </p>
          <p className='text-foreground mt-2 text-base font-semibold'>
            {t('settings.account.title')}
          </p>
        </div>
        <div className='flex justify-center rounded-full'>
          <UserIcon className='text-primary h-5 w-5' />
        </div>
      </div>

      <div className='bg-card/80 border-border/45 flex flex-col gap-3 rounded-2xl border p-4'>
        <div className='flex items-center gap-4'>
          <div>
            <Label className='text-foreground text-base'>{displayName}</Label>
            <Label className='text-muted-foreground text-sm'>{displayEmail}</Label>
          </div>
        </div>
        <div className='text-muted-foreground text-sm'>{t('settings.account.helper')}</div>
        <div className='flex flex-row gap-3'>
          <Input
            placeholder={t('settings.account.fields.displayName')}
            value={displayNameInput}
            onChange={(event) => setDisplayNameInput(event.target.value)}
          />
          <Button
            disabled={updateUser.isPending || !hasChanged}
            size={'sm'}
            onClick={handleUpdateDisplayName}>
            {updateUser.isPending
              ? t('common.actions.processing')
              : t('settings.account.actions.saveDisplayName')}
          </Button>
        </div>
      </div>
    </CardSection>
  )
}
