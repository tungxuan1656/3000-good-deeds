import { EditIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUpdateUser } from '@/hooks/api/use-user'
import { useAuthProvider } from '@/hooks/auth/use-auth-provider'
import { t } from '@/lib/i18n'
import { authActions } from '@/stores/auth.store'
import type { UserDTO } from '@/types/api'

import { Card, Label } from '../ui'

interface AccountProfileCardProps {
  user?: UserDTO | null
}

export const AccountProfileCard = ({ user }: AccountProfileCardProps) => {
  const [displayNameInput, setDisplayNameInput] = useState(
    user?.displayName ?? '',
  )
  const [editingDisplayName, setEditingDisplayName] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const updateUser = useUpdateUser()
  const { updateDisplayNameOnly } = useAuthProvider()

  useEffect(() => {
    setDisplayNameInput(user?.displayName ?? '')
  }, [user?.displayName])

  const displayName = user?.displayName ?? t('layout.user.fallbackName')
  const displayEmail = user?.email ?? t('layout.user.emailMissing')

  const handleUpdateDisplayName = async () => {
    const nextDisplayName = displayNameInput.trim()
    if (!nextDisplayName) {
      toast.error(t('settings.account.errors.emptyDisplayName'))

      return
    }

    try {
      setIsSaving(true)
      await updateDisplayNameOnly(nextDisplayName)

      const response = await updateUser.mutateAsync({
        displayName: nextDisplayName,
      })

      if (response?.data) {
        authActions.setUser(response.data)
      }
      toast.success(t('settings.account.messages.updated'))
    } catch {
      toast.error(t('settings.account.errors.updateFailed'))
    } finally {
      setEditingDisplayName(false)
      setIsSaving(false)
    }
  }

  return (
    <Card className='flex flex-col gap-2'>
      <h4 className='text-foreground text-base font-semibold md:text-xl'>
        {t('settings.account.title')}
      </h4>
      <Label className='text-muted-foreground font-headline text-xs md:text-sm'>
        {displayEmail}
      </Label>
      <div className='flex items-center gap-0.5'>
        {editingDisplayName ? (
          <Input
            className='border-border h-8 w-auto bg-transparent py-0 md:min-w-48'
            placeholder={t('settings.account.fields.displayName')}
            value={displayNameInput}
            onChange={(event) => setDisplayNameInput(event.target.value)}
          />
        ) : (
          <Label className='text-foreground text-sm md:text-base'>
            {displayName}
          </Label>
        )}
        {editingDisplayName ? (
          <>
            <Button
              className='ml-1 h-7'
              size={'xs'}
              variant={'outline'}
              onClick={handleUpdateDisplayName}>
              {!isSaving
                ? t('common.actions.save')
                : t('common.actions.saving')}
            </Button>
            <Button
              className='h-7'
              size={'xs'}
              variant={'ghost'}
              onClick={() => setEditingDisplayName(false)}>
              {t('common.actions.cancel')}
            </Button>
          </>
        ) : (
          <Button
            size={'icon-sm'}
            variant={'ghost'}
            onClick={() => setEditingDisplayName(true)}>
            <EditIcon className='size-4' />
          </Button>
        )}
      </div>
    </Card>
  )
}
