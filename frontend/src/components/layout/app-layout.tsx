import { useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { toast } from 'sonner'

import { AppSidebar, BottomTab } from '@/components/layout'
import { ConfirmDialog, type ConfirmDialogHandle } from '@/components/shared/confirm-dialog'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { isPushSupported, subscribeToPushNotifications } from '@/lib/push-notifications'
import { useAuthStore } from '@/stores/auth-store'

import { AppHeader } from './app-header'

const AppLayout = () => {
  const user = useAuthStore.use.user()
  const refNotificationDialog = useRef<ConfirmDialogHandle>(null)

  useEffect(() => {
    if (!user?.id || !user.reminderEnabled) return
    if (!isPushSupported()) return

    refNotificationDialog.current?.open()
  }, [user?.id, user?.reminderEnabled])

  const handleConfirmPushPermission = async () => {
    try {
      const result = await subscribeToPushNotifications()

      if (!result.success) {
        toast.error(result.error ?? 'Không thể bật thông báo lúc này.')

        return
      }
      toast.success('Đã bật thông báo nhắc nhở trên thiết bị này.')
    } finally {
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
      </SidebarInset>
      <ConfirmDialog
        ref={refNotificationDialog}
        confirmLabel='Bật thông báo'
        description='Để app có thể nhắc nhẹ mỗi ngày, bạn cần cấp quyền thông báo cho thiết bị này.'
        title='Cho phép thông báo nhắc nhở?'
        onCancel={() => refNotificationDialog.current?.close()}
        onConfirm={() => {
          handleConfirmPushPermission()
          refNotificationDialog.current?.close()
        }}
      />
    </SidebarProvider>
  )
}

export default AppLayout
