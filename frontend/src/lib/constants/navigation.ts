import {
  GripIcon,
  HeartHandshakeIcon,
  HomeIcon,
  LeafIcon,
  LineChartIcon,
  SettingsIcon,
  TargetIcon,
  TimerIcon,
} from 'lucide-react'

import { t } from '@/lib/i18n'

import { PATHS } from './paths'

export const APP_MENU_ITEMS = [
  { label: t('layout.menu.home'), path: PATHS.HOME, icon: HomeIcon },
  { label: t('layout.menu.timeline'), path: PATHS.TIMELINE, icon: TimerIcon },
  { label: t('layout.menu.inner'), path: PATHS.INNER, icon: LeafIcon },
  { label: t('layout.menu.stats'), path: PATHS.STATS, icon: LineChartIcon },
  { label: t('layout.menu.goals'), path: PATHS.GOALS, icon: TargetIcon },
  {
    label: t('layout.menu.suggestedDeeds'),
    path: PATHS.INNER_RANDOM_ACTS,
    icon: HeartHandshakeIcon,
  },
  { label: t('layout.menu.settings'), path: PATHS.SETTINGS, icon: SettingsIcon },
]

export const BOTTOM_TAB_ITEMS = [
  { label: t('layout.menu.home'), path: PATHS.HOME, icon: HomeIcon },
  { label: t('layout.menu.timeline'), path: PATHS.TIMELINE, icon: TimerIcon },
  { label: t('layout.menu.inner'), path: PATHS.INNER, icon: LeafIcon },
  { label: t('layout.menu.stats'), path: PATHS.STATS, icon: LineChartIcon },
  { label: t('layout.menu.more'), path: PATHS.MORE, icon: GripIcon },
]
