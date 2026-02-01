import { UserRoundIcon } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'

import MenuDropdown from '@/components/shared/menu-dropdown'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'

const breadcrumbLabels: Record<string, string> = {
  timeline: 'Hành trình',
  stats: 'Thống kê',
  goals: 'Mục tiêu',
  inner: 'Nội tâm',
  settings: 'Cài đặt',
}

const AppLayout = () => {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  const breadcrumbs = [{ label: 'Trang chủ', path: '/' }]
  let currentPath = ''

  for (const segment of segments) {
    currentPath += `/${segment}`

    breadcrumbs.push({
      label: breadcrumbLabels[segment] ?? decodeURIComponent(segment),
      path: currentPath,
    })
  }

  return (
    <div className='bg-background min-h-screen pb-24'>
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='bg-primary/10 absolute -top-20 right-0 h-72 w-72 rounded-full blur-3xl' />
        <div className='bg-secondary/30 absolute top-40 left-6 h-48 w-48 rounded-full blur-3xl' />
      </div>

      <div className='relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-6 sm:gap-7 sm:px-6 lg:gap-8 lg:px-8'>
        <header className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <MenuDropdown />
            <Breadcrumb>
              <BreadcrumbList className='text-sm font-semibold'>
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1

                  return (
                    <BreadcrumbItem key={crumb.path}>
                      {index > 0 && <BreadcrumbSeparator className='text-muted-foreground/50' />}
                      {isLast ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={crumb.path}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Button
            aria-label='Hồ sơ'
            className='text-foreground h-11 w-11 rounded-full bg-white/80 shadow-sm hover:bg-white'
            size='icon'
            variant='ghost'>
            <UserRoundIcon className='h-5 w-5' />
          </Button>
        </header>

        <main className='flex flex-col gap-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
