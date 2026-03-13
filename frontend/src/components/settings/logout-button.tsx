import { LogOutIcon } from 'lucide-react'
import type React from 'react'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { logout } from '@/api/auth'
import { PATHS } from '@/lib/constants'
import { t } from '@/lib/i18n'
import { unsubscribeFromPushNotifications } from '@/lib/push-notifications'
import { authActions } from '@/stores/auth-store'

import { ConfirmDialog, type ConfirmDialogHandle } from '../shared'
import { Button } from '../ui/button'

export const LogoutButton = (props: React.ComponentProps<typeof Button>) => {
  const navigate = useNavigate()
  const logoutDialogRef = useRef<ConfirmDialogHandle>(null)

  const handleLogout = async () => {
    try {
      await unsubscribeFromPushNotifications()
      await logout()
    } catch {
      // Ignore logout errors and still clear local state
    } finally {
      authActions.logout()
      navigate(PATHS.LOGIN, { replace: true })
    }
  }

  return (
    <>
      <Button {...props} onClick={() => logoutDialogRef.current?.open()}>
        <LogOutIcon className='h-4 w-4' />
        {t('settings.session.logoutAction')}
      </Button>
      <ConfirmDialog
        ref={logoutDialogRef}
        cancelLabel={t('common.actions.later')}
        confirmLabel={t('settings.session.logoutAction')}
        description={t('settings.session.logoutDescription')}
        title={t('settings.session.logoutTitle')}
        onConfirm={() => {
          logoutDialogRef.current?.close()
          handleLogout()
        }}
      />
    </>
  )
}
