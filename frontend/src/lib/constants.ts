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
  INNER_RANDOM_ACTS: '/inner/random-acts',
  INNER_JOURNAL: '/inner/journal',
  INNER_JOURNAL_NEW: '/inner/journal/new',
  INNER_JOURNAL_HISTORY: '/inner/journal/history',
  INNER_MEDITATION: '/inner/meditation',
  SETTINGS: '/settings',
}

export const INNER_JOURNAL_TYPES = ['gratitude', 'repentance'] as const
export type InnerJournalType = (typeof INNER_JOURNAL_TYPES)[number]

export const INNER_JOURNAL_TYPE_LABELS: Record<InnerJournalType, string> = {
  gratitude: 'Biết ơn',
  repentance: 'Sám hối',
}

export const INNER_JOURNAL_TYPE_GUIDANCE: Record<InnerJournalType, string> = {
  repentance:
    'Hãy chậm lại một chút, nhìn thẳng vào điều đã khiến tâm bạn bất an hôm nay, ghi lại với sự trung thực và nhẹ nhàng, không để tự trách, chỉ để thấy rõ và buông xuống.',
  gratitude:
    'Hãy dành một khoảnh khắc nhận ra điều tốt đẹp đã đến với mình trong ngày, dù rất nhỏ, ghi lại để nuôi dưỡng sự trân trọng và giúp tâm mình lắng dịu hơn.',
}

export const INNER_JOURNAL_IMMUTABLE_NOTE =
  'Những dòng này được giữ nguyên như khoảnh khắc bạn đã thấy và đã viết; sau khi lưu, nội dung sẽ không sửa lại được, để việc quán chiếu được trọn vẹn và những gì được viết ra có thể buông xuống.'

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
