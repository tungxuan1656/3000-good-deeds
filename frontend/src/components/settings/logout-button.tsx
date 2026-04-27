'use client'

import { LogOutIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { useRef } from 'react'

import { logout } from '@/api/auth'
import { useAuthProvider } from '@/hooks/auth/use-auth-provider'
import { authTokenStorage } from '@/lib/auth-tokens'
import { PATHS } from '@/lib/constants/paths'
import { t } from '@/lib/i18n'
import { unsubscribeFromPushNotifications } from '@/lib/utils/push-notifications'
import { authActions } from '@/stores/auth.store'

import {
  ConfirmDialog,
  type ConfirmDialogHandle,
} from '../shared/confirm-dialog'
import { Button } from '../ui/button'

export const LogoutButton = (props: React.ComponentProps<typeof Button>) => {
  const router = useRouter()
  const logoutDialogRef = useRef<ConfirmDialogHandle>(null)
  const { logoutProvider } = useAuthProvider()

  const handleLogout = async () => {
    try {
      await unsubscribeFromPushNotifications()
      await logout(authTokenStorage.getRefreshToken() ?? undefined)
      await logoutProvider()
    } catch {
      // Ignore logout errors and still clear local state
    } finally {
      authActions.logout()
      router.replace(PATHS.LOGIN)
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
