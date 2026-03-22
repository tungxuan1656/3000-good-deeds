import { Link, useLocation } from 'react-router-dom'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { APP_MENU_ITEMS, PATHS } from '@/lib/constants'
import { t } from '@/lib/i18n'
import { useAuthStore } from '@/stores/auth.store'

import { LogoutButton } from '../settings/logout-button'

export const AppSidebar = () => {
  const location = useLocation()
  const user = useAuthStore.use.user()
  const displayName = user?.displayName ?? t('layout.user.fallbackName')
  const displayEmail = user?.email ?? t('layout.user.emailMissing')

  return (
    <Sidebar className='bg-card'>
      <SidebarHeader>
        <div className='bg-surface-container-high mt-4 flex flex-col gap-1 rounded-2xl px-3 py-3'>
          <p className='text-foreground truncate text-sm font-semibold'>{displayName}</p>
          <p className='text-muted-foreground truncate text-xs'>{displayEmail}</p>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('layout.menu.title')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {APP_MENU_ITEMS.map(({ label, path, icon: Icon }) => {
                const isActive = (() => {
                  if (path === PATHS.HOME) return location.pathname === PATHS.HOME

                  return location.pathname.startsWith(path)
                })()

                return (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
                      <Link to={path}>
                        <Icon />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutButton className='text-destructive w-full font-semibold' variant={'ghost'} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
