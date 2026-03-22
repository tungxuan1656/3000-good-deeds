import { Edit3Icon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { APP_MENU_ITEMS, PATHS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useCheckInStore } from '@/stores/check-in.store'

import { LogoutButton } from '../settings/logout-button'
import { Button } from '../ui/button'

export const AppSidebar = () => {
  const location = useLocation()
  const openCheckIn = useCheckInStore.use.open()

  return (
    <Sidebar className='bg-sidebar border-none'>
      <SidebarHeader className='px-6 pt-10 pb-4'>
        <div className='flex flex-col gap-1.5'>
          <h1 className='font-headline text-primary text-xl font-bold group-data-[collapsible=icon]:hidden'>
            The Living Journal
          </h1>
          <p className='text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase group-data-[collapsible=icon]:hidden'>
            Kindness in Focus
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className='px-0'>
          <SidebarGroupContent>
            <SidebarMenu className='gap-0'>
              {APP_MENU_ITEMS.map(({ label, path, icon: Icon }) => {
                const isActive = (() => {
                  if (path === PATHS.HOME) return location.pathname === PATHS.HOME

                  return location.pathname.startsWith(path)
                })()

                return (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        'group relative h-auto rounded-none px-6 py-3.5 transition-colors hover:bg-black/5 active:bg-black/10',
                        isActive ? 'text-foreground' : 'text-muted-foreground/60',
                      )}
                      isActive={isActive}
                      tooltip={label}>
                      <Link className='flex items-center gap-4' to={path}>
                        {isActive && (
                          <div className='bg-primary absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-full' />
                        )}
                        <Icon
                          className={cn(
                            'size-5 transition-colors duration-300',
                            isActive ? 'text-primary' : 'text-muted-foreground/60',
                          )}
                        />
                        <span className={cn('font-medium transition-all', isActive ? 'font-bold' : '')}>
                          {label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className='p-6'>
        <Button
          className='bg-primary text-primary-foreground shadow-primary/20 w-full justify-center gap-2 rounded-xl py-6 text-sm font-bold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]'
          onClick={openCheckIn}>
          <Edit3Icon className='size-5' />
          Log a Deed
        </Button>
        <SidebarMenu className='mt-4'>
          <SidebarMenuItem>
            <LogoutButton
              className='text-muted-foreground/50 hover:text-destructive w-full text-xs font-semibold'
              variant={'ghost'}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
