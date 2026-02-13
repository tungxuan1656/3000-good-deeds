import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { AppSidebar, BottomTab } from '@/components/layout'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { isPushSupported, syncPushSubscriptionSilently } from '@/lib/push-notifications'
import { useAuthStore } from '@/stores/auth-store'

import { Toaster } from '../ui/sonner'
import { AppHeader } from './app-header'

const AppLayout = () => {
  const user = useAuthStore.use.user()

  useEffect(() => {
    if (!user?.id || !user.reminderEnabled) return
    if (!isPushSupported()) return

    syncPushSubscriptionSilently()
  }, [user?.id, user?.reminderEnabled])

  return (
    <SidebarProvider className='bg-background relative min-h-screen pb-24 md:pb-0'>
      <AppSidebar />
      <SidebarInset>
        <div className='relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-6 sm:gap-7 sm:px-6 lg:gap-8 lg:px-8'>
          <AppHeader />
          <main className='flex flex-col gap-6'>
            <Outlet />
          </main>
          <Toaster position='top-center' />
        </div>
        <BottomTab />
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AppLayout
