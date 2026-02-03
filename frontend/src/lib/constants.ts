import {
  HomeIcon,
  LeafIcon,
  LineChartIcon,
  SettingsIcon,
  TargetIcon,
  TimerIcon,
} from 'lucide-react'

export const PATHS = {
  LOGIN: '/login',
  HOME: '/',
  TIMELINE: '/timeline',
  STATS: '/stats',
  GOALS: '/goals',
  ACHIEVEMENTS: '/achievements',
  DEEDS: '/deeds',
  DEED_DETAIL: (id: string) => `/deeds/${id}`,
  INNER: '/inner',
  INNER_QUOTE: '/inner/quote',
  INNER_RANDOM_ACTS: '/inner/random-acts',
  INNER_JOURNAL: '/inner/journal',
  INNER_JOURNAL_NEW: '/inner/journal/new',
  INNER_JOURNAL_DETAIL: (id: string) => `/inner/journal/${id}`,
  INNER_MEDITATION: '/inner/meditation',
  SETTINGS: '/settings',
}

export const APP_MENU_ITEMS = [
  { label: 'Trang chủ', path: PATHS.HOME, icon: HomeIcon },
  { label: 'Hành trình', path: PATHS.TIMELINE, icon: TimerIcon },
  { label: 'Thống kê', path: PATHS.STATS, icon: LineChartIcon },
  { label: 'Mục tiêu', path: PATHS.GOALS, icon: TargetIcon },
  { label: 'Nội tâm', path: PATHS.INNER, icon: LeafIcon },
  { label: 'Cài đặt', path: PATHS.SETTINGS, icon: SettingsIcon },
]

export const CATEGORIES = {
  body: {
    classname: 'bg-body/20 hover:bg-body/40',
    icon: '/icons/icon_than.png',
    label: 'Thân',
    description: 'Hỗ trợ, giúp đỡ, hành động thiện lành',
  },
  speech: {
    classname: 'bg-speech/20 hover:bg-speech/40',
    icon: '/icons/icon_khau.png',
    label: 'Khẩu',
    description: 'Lời nói hiền lành & nâng đỡ người khác',
  },
  mind: {
    classname: 'bg-mind/20 hover:bg-mind/40',
    icon: '/icons/icon_y.png',
    label: 'Ý',
    description: 'Suy nghĩ tốt đẹp & thiện lành',
  },
}
