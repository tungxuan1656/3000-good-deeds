import { LogOutIcon, MenuIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { logout } from '@/api/auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { APP_MENU_ITEMS, PATHS } from '@/lib/constants'
import { authActions, useAuthStore } from '@/stores/auth-store'

const MenuDropdown = () => {
  const navigate = useNavigate()
  const refreshToken = useAuthStore.use.refreshToken()

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
  const user = useAuthStore.use.user()
  const displayName = user?.displayName ?? 'Bạn'
  const displayEmail = user?.email ?? 'Chưa có email'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label='Mở menu'
          className='text-foreground h-11 w-11 rounded-full bg-white/80 shadow-sm hover:bg-white'
          size='icon'
          variant='ghost'>
          <MenuIcon className='h-5 w-5' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-64 rounded-2xl bg-white p-2 shadow-xl'>
        <Link to={PATHS.SETTINGS}>
          <div className='flex items-center gap-3 rounded-2xl border border-black/5 bg-white px-1 py-2'>
            <div className='bg-secondary/40 text-foreground flex h-10 min-h-10 w-10 min-w-10 items-center justify-center rounded-full'>
              <img alt={displayName} src={user?.avatarUrl ?? ''} />
            </div>
            <div className='min-w-0'>
              <p className='text-foreground truncate text-sm font-semibold'>{displayName}</p>
              <p className='text-muted-foreground truncate text-xs'>{displayEmail}</p>
            </div>
          </div>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
          Menu
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {APP_MENU_ITEMS.map(({ label, path, icon: Icon }) => (
          <DropdownMenuItem key={label} asChild>
            <Link
              className='text-foreground flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium'
              to={path}>
              <Icon className='text-muted-foreground h-4 w-4' />
              <span>{label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='text-destructive focus:text-destructive cursor-pointer rounded-xl px-3 py-2 text-sm font-medium'
          onClick={handleLogout}>
          <LogOutIcon className='h-4 w-4' />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MenuDropdown
