import {
  HomeIcon,
  LeafIcon,
  LineChartIcon,
  LogOutIcon,
  MenuIcon,
  SettingsIcon,
  TargetIcon,
  TimerIcon,
  UserRoundIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useAuthStore from '@/stores/auth-store'

const menuItems = [
  { label: 'Trang chủ', path: '/', icon: HomeIcon },
  { label: 'Hành trình', path: '/timeline', icon: TimerIcon },
  { label: 'Thống kê', path: '/stats', icon: LineChartIcon },
  { label: 'Mục tiêu', path: '/goals', icon: TargetIcon },
  { label: 'Nội tâm', path: '/inner', icon: LeafIcon },
  { label: 'Cài đặt', path: '/settings', icon: SettingsIcon },
]

const MenuDropdown = () => {
  const user = useAuthStore((state) => state.user)
  const displayName = user?.name ?? 'Bạn'
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
      <DropdownMenuContent align='start' className='w-56 rounded-2xl bg-white p-2 shadow-xl'>
        <div className='flex items-center gap-3 rounded-2xl border border-black/5 bg-white px-3 py-2'>
          <div className='bg-secondary/40 text-foreground flex h-10 w-10 items-center justify-center rounded-full'>
            <UserRoundIcon className='h-5 w-5' />
          </div>
          <div className='min-w-0'>
            <p className='text-foreground truncate text-sm font-semibold'>{displayName}</p>
            <p className='text-muted-foreground truncate text-xs'>{displayEmail}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
          Menu
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuItems.map(({ label, path, icon: Icon }) => (
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
        <DropdownMenuItem className='text-destructive focus:text-destructive cursor-pointer rounded-xl px-3 py-2 text-sm font-medium'>
          <LogOutIcon className='h-4 w-4' />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MenuDropdown
