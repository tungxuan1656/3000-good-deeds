import {
  HomeIcon,
  LeafIcon,
  LineChartIcon,
  SettingsIcon,
  TargetIcon,
  TimerIcon,
} from 'lucide-react'

import type { GoalTypeDTO } from '@/types/api'

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

export const GOAL_TYPES = ['weekly', 'monthly', 'yearly'] as const
export const GOAL_LABELS: Record<GoalTypeDTO, string> = {
  weekly: 'Mục tiêu tuần',
  monthly: 'Mục tiêu tháng',
  yearly: 'Mục tiêu năm',
}

export const MOOD_TAGS = ['An vui', 'Biết ơn', 'Nhẹ lòng', 'Ấm áp', 'Bình an', 'Hy vọng']
