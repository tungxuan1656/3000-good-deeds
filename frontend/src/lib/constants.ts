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
import type { GoalTypeDTO } from '@/types/api'

export const PATHS = {
  LOGIN: '/login',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  HOME: '/',
  TIMELINE: '/timeline',
  STATS: '/stats',
  GOALS: '/goals',
  DEEDS: '/deeds',
  INNER: '/inner',
  MORE: '/more',
  INNER_RANDOM_ACTS: '/inner/random-acts',
  INNER_JOURNAL: '/inner/journal',
  INNER_JOURNAL_HISTORY: '/inner/journal/history',
  SETTINGS: '/settings',
}

export const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || ''
export const APP_VERSION = __APP_VERSION__

export const INNER_JOURNAL_TYPES = ['gratitude', 'repentance'] as const
export type InnerJournalType = (typeof INNER_JOURNAL_TYPES)[number]

export const INNER_JOURNAL_TYPE_LABELS: Record<InnerJournalType, string> = {
  gratitude: t('constants.innerJournal.types.gratitude'),
  repentance: t('constants.innerJournal.types.repentance'),
}

export const INNER_JOURNAL_TYPE_GUIDANCE: Record<InnerJournalType, string> = {
  repentance: t('journal.types.repentance.guidance'),
  gratitude: t('journal.types.gratitude.guidance'),
}

export const INNER_JOURNAL_IMMUTABLE_NOTE = t('constants.innerJournal.immutableNote')

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

export const GOAL_TYPES = ['weekly', 'monthly', 'yearly'] as const
export const GOAL_LABELS: Record<GoalTypeDTO, string> = {
  weekly: t('constants.goals.weekly'),
  monthly: t('constants.goals.monthly'),
  yearly: t('constants.goals.yearly'),
}

export const MOOD_TAGS = [
  t('constants.moodTags.peaceful'),
  t('constants.moodTags.grateful'),
  t('constants.moodTags.lightHearted'),
  t('constants.moodTags.warm'),
  t('constants.moodTags.calm'),
  t('constants.moodTags.hopeful'),
] as const

type OnboardingFlowKey = 'general' | 'deeds' | 'quoteRandomActs' | 'journey' | 'stats' | 'journal'

type OnboardingStep = {
  image: string
  title: string
  description: string
}

type OnboardingFlow = {
  title: string
  steps: OnboardingStep[]
}

const createOnboardingStep = (
  image: string,
  titleKey: string,
  descriptionKey: string,
): OnboardingStep => {
  return {
    image,
    title: t(titleKey),
    description: t(descriptionKey),
  }
}

export const ONBOARDING_CONTENT = {
  general: {
    title: t('onboarding.general.title'),
    steps: [
      createOnboardingStep(
        '/onboarding/onboarding_1.1.jpg',
        'onboarding.general.steps.0.title',
        'onboarding.general.steps.0.description',
      ),
      createOnboardingStep(
        '/onboarding/onboarding_1.2.jpg',
        'onboarding.general.steps.1.title',
        'onboarding.general.steps.1.description',
      ),
      createOnboardingStep(
        '/onboarding/onboarding_1.3.jpg',
        'onboarding.general.steps.2.title',
        'onboarding.general.steps.2.description',
      ),
      createOnboardingStep(
        '/onboarding/onboarding_1.4.jpg',
        'onboarding.general.steps.3.title',
        'onboarding.general.steps.3.description',
      ),
    ],
  },
  deeds: {
    title: t('onboarding.deeds.title'),
    steps: [
      createOnboardingStep(
        '/onboarding/onboarding_2.1.jpg',
        'onboarding.deeds.steps.0.title',
        'onboarding.deeds.steps.0.description',
      ),
      createOnboardingStep(
        '/onboarding/onboarding_2.2.jpg',
        'onboarding.deeds.steps.1.title',
        'onboarding.deeds.steps.1.description',
      ),
      createOnboardingStep(
        '/onboarding/onboarding_2.3.jpg',
        'onboarding.deeds.steps.2.title',
        'onboarding.deeds.steps.2.description',
      ),
      createOnboardingStep(
        '/onboarding/onboarding_2.4.jpg',
        'onboarding.deeds.steps.3.title',
        'onboarding.deeds.steps.3.description',
      ),
    ],
  },
  quoteRandomActs: {
    title: t('onboarding.quoteRandomActs.title'),
    steps: [
      createOnboardingStep(
        '/onboarding/onboarding_3.1.jpg',
        'onboarding.quoteRandomActs.steps.0.title',
        'onboarding.quoteRandomActs.steps.0.description',
      ),
      createOnboardingStep(
        '/onboarding/onboarding_3.2.jpg',
        'onboarding.quoteRandomActs.steps.1.title',
        'onboarding.quoteRandomActs.steps.1.description',
      ),
    ],
  },
  journey: {
    title: t('onboarding.journey.title'),
    steps: [
      createOnboardingStep(
        '/onboarding/onboarding_4.1.jpg',
        'onboarding.journey.steps.0.title',
        'onboarding.journey.steps.0.description',
      ),
      createOnboardingStep(
        '/onboarding/onboarding_4.2.jpg',
        'onboarding.journey.steps.1.title',
        'onboarding.journey.steps.1.description',
      ),
    ],
  },
  stats: {
    title: t('onboarding.stats.title'),
    steps: [
      createOnboardingStep(
        '/onboarding/onboarding_5.1.jpg',
        'onboarding.stats.steps.0.title',
        'onboarding.stats.steps.0.description',
      ),
      createOnboardingStep(
        '/onboarding/onboarding_5.2.jpg',
        'onboarding.stats.steps.1.title',
        'onboarding.stats.steps.1.description',
      ),
    ],
  },
  journal: {
    title: t('onboarding.journal.title'),
    steps: [
      createOnboardingStep(
        '/onboarding/onboarding_6.1.jpg',
        'onboarding.journal.steps.0.title',
        'onboarding.journal.steps.0.description',
      ),
      createOnboardingStep(
        '/onboarding/onboarding_6.2.jpg',
        'onboarding.journal.steps.1.title',
        'onboarding.journal.steps.1.description',
      ),
      createOnboardingStep(
        '/onboarding/onboarding_6.3.jpg',
        'onboarding.journal.steps.2.title',
        'onboarding.journal.steps.2.description',
      ),
    ],
  },
} satisfies Record<OnboardingFlowKey, OnboardingFlow>

export const ONBOARDING_KEYS = {
  general: 'onboarding.general.v1',
  deeds: 'onboarding.deeds.v1',
  quoteRandomActs: 'onboarding.quoteRandomActs.v1',
  journey: 'onboarding.journey.v1',
  stats: 'onboarding.stats.v1',
  journal: 'onboarding.journal.v1',
}
