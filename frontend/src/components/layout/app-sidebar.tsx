import { LogOutIcon, UserRoundIcon } from 'lucide-react'
import { useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { logout } from '@/api/auth'
import type { ConfirmDialogHandle } from '@/components/shared/confirm-dialog'
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
import { ConfirmDialog } from '@/components/shared'
import { APP_MENU_ITEMS, PATHS } from '@/lib/constants'
import { authActions, useAuthStore } from '@/stores/auth-store'

export const AppSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore.use.user()
  const refreshToken = useAuthStore.use.refreshToken()
  const logoutDialogRef = useRef<ConfirmDialogHandle>(null)
  const displayName = user?.displayName ?? 'Bạn'
  const displayEmail = user?.email ?? 'Chưa có email'

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await logout(refreshToken)
      }
    } catch {
      // Ignore logout errors and still clear local state
    } finally {
      authActions.logout()
      navigate(PATHS.LOGIN, { replace: true })
    }
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
            <SidebarMenuButton
              className='text-destructive'
              onClick={() => logoutDialogRef.current?.open()}>
              <LogOutIcon />
              <span>Đăng xuất</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <ConfirmDialog
        ref={logoutDialogRef}
        cancelLabel='Để sau'
        confirmLabel='Đăng xuất'
        description='Bạn có thể đăng nhập lại bất cứ lúc nào.'
        title='Đăng xuất khỏi tài khoản?'
        onConfirm={() => {
          logoutDialogRef.current?.close()
          handleLogout()
        }}
      />
    </Sidebar>
  )
}
