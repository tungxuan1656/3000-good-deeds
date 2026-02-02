import { LogOutIcon, UserRoundIcon } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

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
import { APP_MENU_ITEMS } from '@/lib/constants'
import useAuthStore from '@/stores/auth-store'

export const AppSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const displayName = user?.displayName ?? 'Bạn'
  const displayEmail = user?.email ?? 'Chưa có email'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <Sidebar className='bg-white'>
      <SidebarHeader>
        <div className='mt-4 flex items-center gap-3 rounded-2xl border border-black/5 bg-white/80 px-3 py-2'>
          <div className='bg-secondary/40 text-foreground flex h-10 w-10 items-center justify-center rounded-full'>
            {user?.avatarUrl ? (
              <img alt={displayName} className='h-full w-full rounded-full' src={user.avatarUrl} />
            ) : (
              <UserRoundIcon className='h-5 w-5' />
            )}
          </div>
          <div className='min-w-0'>
            <p className='text-foreground truncate text-sm font-semibold'>{displayName}</p>
            <p className='text-muted-foreground truncate text-xs'>{displayEmail}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {APP_MENU_ITEMS.map(({ label, path, icon: Icon }) => {
                const isActive =
                  path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

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
            <SidebarMenuButton className='text-destructive' onClick={handleLogout}>
              <LogOutIcon />
              <span>Đăng xuất</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
