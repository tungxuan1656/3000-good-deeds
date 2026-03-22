import { useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { toast } from 'sonner'

import { AppSidebar, BottomTab } from '@/components/layout'
import { CheckInSheet } from '@/components/shared'
import { ConfirmDialog, type ConfirmDialogHandle } from '@/components/shared/confirm-dialog'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { t } from '@/lib/i18n'
import {
  isPushSupported,
  subscribeToPushNotifications,
  syncPushSubscription,
} from '@/lib/utils/push-notifications'
import { useAuthStore } from '@/stores/auth.store'

import { AppHeader } from './app-header'
import { PWAGuideDialog } from './pwa-guide-dialog'

export const AppLayout = () => {
  const user = useAuthStore.use.user()
  const refNotificationDialog = useRef<ConfirmDialogHandle>(null)

  useEffect(() => {
    if (!user?.id || !user.reminderEnabled) return
    if (!isPushSupported()) return

    const permission = Notification.permission

    // Already granted: keep subscription synced silently, no need to ask again.
    if (permission === 'granted') {
      void syncPushSubscription({ requestPermission: false })

      return
    }

    // Denied: do not reopen permission dialog repeatedly.
    if (permission === 'denied') return

    // default: ask user once via confirm dialog.
    refNotificationDialog.current?.open()
  }, [user?.id, user?.reminderEnabled])

  const handleConfirmPushPermission = async () => {
    try {
      const result = await subscribeToPushNotifications()

      if (!result.success) {
        toast.error(result.error ?? t('pwa.notifications.enableFailed'))

        return
      }
      toast.success(t('pwa.notifications.enabled'))
    } catch {
      toast.error(t('pwa.notifications.enableFailed'))
    }
  }

  return (
    <SidebarProvider className='bg-background relative min-h-screen pb-24 md:pb-0'>
      <AppSidebar />
      <SidebarInset>
        <div className='relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-6 sm:gap-7 sm:px-6 lg:gap-8 lg:px-8'>
          <AppHeader />
          <main className='flex flex-col gap-6'>
            <Outlet />
          </main>
        </div>
        <BottomTab />
        <CheckInSheet />
      </SidebarInset>
      <ConfirmDialog
        ref={refNotificationDialog}
        confirmLabel={t('pwa.notifications.enableAction')}
        description={t('pwa.notifications.permissionDescription')}
        title={t('pwa.notifications.permissionTitle')}
        onCancel={() => refNotificationDialog.current?.close()}
        onConfirm={() => {
          handleConfirmPushPermission()
          refNotificationDialog.current?.close()
        }}
      />
      <PWAGuideDialog />
    </SidebarProvider>
  )
}
