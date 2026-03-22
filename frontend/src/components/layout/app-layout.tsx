import { useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { toast } from 'sonner'

import { AppSidebar, BottomTab } from '@/components/layout'
import { CheckInSheet } from '@/components/shared'
import { ConfirmDialog, type ConfirmDialogHandle } from '@/components/shared/confirm-dialog'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'
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
    <div className='min-h-screen md:flex md:items-center md:justify-center'>
      <SidebarProvider
        className={cn(
          'group/sidebar-wrapper flex h-full w-full flex-col md:flex-row',
          'md:bg-background md:max-w-7xl md:overflow-hidden',
        )}>
        <AppSidebar />
        <SidebarInset className='flex flex-1 flex-col overflow-hidden'>
          <div className='flex flex-1 flex-col overflow-y-auto px-4 pt-6 sm:px-6 md:px-8'>
            <AppHeader />
            <main className='mt-6 flex flex-col gap-6 pb-20 md:mt-8 md:pb-8'>
              <Outlet />
            </main>
          </div>
          <BottomTab />
          <CheckInSheet />
        </SidebarInset>
      </SidebarProvider>

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
    </div>
  )
}
