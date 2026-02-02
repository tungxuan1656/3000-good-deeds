import {
  HomeIcon,
  LeafIcon,
  LineChartIcon,
  SettingsIcon,
  TargetIcon,
  TimerIcon,
} from 'lucide-react'

export const APP_MENU_ITEMS = [
  { label: 'Trang chủ', path: '/', icon: HomeIcon },
  { label: 'Hành trình', path: '/timeline', icon: TimerIcon },
  { label: 'Thống kê', path: '/stats', icon: LineChartIcon },
  { label: 'Mục tiêu', path: '/goals', icon: TargetIcon },
  { label: 'Nội tâm', path: '/inner', icon: LeafIcon },
  { label: 'Cài đặt', path: '/settings', icon: SettingsIcon },
]
