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
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { useCheckInStore } from '@/stores/check-in.store'

import { LogoutButton } from '../settings/logout-button'
import { Button } from '../ui/button'

export const AppSidebar = () => {
  const location = useLocation()
  const openCheckIn = useCheckInStore.use.open()

  return (
    <Sidebar className='bg-sidebar overflow-hidden border-none md:inset-auto md:mt-4 md:h-auto md:rounded-2xl!'>
      <SidebarHeader className='p-6'>
        <div className='flex flex-col gap-1.5'>
          <h3 className='font-headline text-primary text-2xl font-medium italic group-data-[collapsible=icon]:hidden'>
            {t('auth.login.brandName')}
          </h3>
          <p className='text-muted-foreground text-xss font-medium tracking-widest uppercase group-data-[collapsible=icon]:hidden'>
            {t('auth.login.heroTitle')}
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
                        'group relative h-auto rounded-none px-5 py-3.5 transition-colors hover:bg-black/5 active:bg-black/10',
                        isActive ? 'text-foreground' : 'text-muted-foreground/60',
                      )}
                      isActive={isActive}
                      tooltip={label}>
                      <Link className='flex items-center gap-4' to={path}>
                        {isActive && (
                          <div className='bg-primary absolute top-1/2 left-0 h-4/5 w-1 -translate-y-1/2 rounded-r-full' />
                        )}
                        <Icon
                          className={cn(
                            'transition-colors duration-300',
                            isActive
                              ? 'text-primary fill-primary/20 size-6'
                              : 'text-muted-foreground/60 size-5',
                          )}
                        />
                        <span
                          className={cn(
                            'font-normal tracking-wide transition-all',
                            isActive ? 'font-semibold' : '',
                          )}>
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
      <SidebarFooter className='mt-10 p-6'>
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
