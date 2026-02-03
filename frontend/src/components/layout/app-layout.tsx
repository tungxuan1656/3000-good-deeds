import { Outlet } from 'react-router-dom'

import { AppSidebar } from '@/components/layout'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import MenuDropdown from '../shared/menu-dropdown'
import { Toaster } from '../ui/sonner'
import { HeaderBreadcrumbs } from './header-breadcrumbs'

const AppLayout = () => {
  return (
    <SidebarProvider className='bg-background relative min-h-screen pb-24'>
      <AppSidebar />
      <SidebarInset>
        <div className='relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-6 sm:gap-7 sm:px-6 lg:gap-8 lg:px-8'>
          <header className='flex items-center gap-4'>
            <div className='md:hidden'>
              <MenuDropdown />
            </div>
            <HeaderBreadcrumbs />
          </header>
          <main className='flex flex-col gap-6'>
            <Outlet />
          </main>
          <Toaster position='top-center' />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AppLayout
