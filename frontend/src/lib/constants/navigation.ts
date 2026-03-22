import { BookOpenIcon, GripIcon, HomeIcon, LineChartIcon, TimerIcon } from 'lucide-react'

import { t } from '@/lib/i18n'

import { PATHS } from './paths'

// Language-change in this app triggers a full page reload, so module-level t() calls are safe.
export const APP_MENU_ITEMS = [
  { label: t('layout.menu.home'), path: PATHS.HOME, icon: HomeIcon },
  { label: t('layout.menu.timeline'), path: PATHS.TIMELINE, icon: TimerIcon },
  { label: t('layout.menu.handbook'), path: PATHS.HANDBOOK, icon: BookOpenIcon },
  { label: t('layout.menu.progress'), path: PATHS.PROGRESS, icon: LineChartIcon },
  { label: t('layout.menu.more'), path: PATHS.MORE, icon: GripIcon },
]

export const BOTTOM_TAB_ITEMS = [
  { label: t('layout.menu.home'), path: PATHS.HOME, icon: HomeIcon },
  { label: t('layout.menu.timeline'), path: PATHS.TIMELINE, icon: TimerIcon },
  { label: t('layout.menu.handbook'), path: PATHS.HANDBOOK, icon: BookOpenIcon },
  { label: t('layout.menu.progress'), path: PATHS.PROGRESS, icon: LineChartIcon },
  { label: t('layout.menu.more'), path: PATHS.MORE, icon: GripIcon },
]
