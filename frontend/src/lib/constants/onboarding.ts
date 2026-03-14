import { t } from '@/lib/i18n'

// Language-change in this app triggers a full page reload, so module-level t() calls are safe.
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

export const ONBOARDING_CONTENT = {
  general: {
    title: t('onboarding.general.title'),
    steps: [
      {
        image: '/onboarding/onboarding_1.1.jpg',
        title: t('onboarding.general.step1.title'),
        description: t('onboarding.general.step1.description'),
      },
      {
        image: '/onboarding/onboarding_1.2.jpg',
        title: t('onboarding.general.step2.title'),
        description: t('onboarding.general.step2.description'),
      },
      {
        image: '/onboarding/onboarding_1.3.jpg',
        title: t('onboarding.general.step3.title'),
        description: t('onboarding.general.step3.description'),
      },
      {
        image: '/onboarding/onboarding_1.4.jpg',
        title: t('onboarding.general.step4.title'),
        description: t('onboarding.general.step4.description'),
      },
    ],
  },
  deeds: {
    title: t('onboarding.deeds.title'),
    steps: [
      {
        image: '/onboarding/onboarding_2.1.jpg',
        title: t('onboarding.deeds.step1.title'),
        description: t('onboarding.deeds.step1.description'),
      },
      {
        image: '/onboarding/onboarding_2.2.jpg',
        title: t('onboarding.deeds.step2.title'),
        description: t('onboarding.deeds.step2.description'),
      },
      {
        image: '/onboarding/onboarding_2.3.jpg',
        title: t('onboarding.deeds.step3.title'),
        description: t('onboarding.deeds.step3.description'),
      },
      {
        image: '/onboarding/onboarding_2.4.jpg',
        title: t('onboarding.deeds.step4.title'),
        description: t('onboarding.deeds.step4.description'),
      },
    ],
  },
  quoteRandomActs: {
    title: t('onboarding.quoteRandomActs.title'),
    steps: [
      {
        image: '/onboarding/onboarding_3.1.jpg',
        title: t('onboarding.quoteRandomActs.step1.title'),
        description: t('onboarding.quoteRandomActs.step1.description'),
      },
      {
        image: '/onboarding/onboarding_3.2.jpg',
        title: t('onboarding.quoteRandomActs.step2.title'),
        description: t('onboarding.quoteRandomActs.step2.description'),
      },
    ],
  },
  journey: {
    title: t('onboarding.journey.title'),
    steps: [
      {
        image: '/onboarding/onboarding_4.1.jpg',
        title: t('onboarding.journey.step1.title'),
        description: t('onboarding.journey.step1.description'),
      },
      {
        image: '/onboarding/onboarding_4.2.jpg',
        title: t('onboarding.journey.step2.title'),
        description: t('onboarding.journey.step2.description'),
      },
    ],
  },
  stats: {
    title: t('onboarding.stats.title'),
    steps: [
      {
        image: '/onboarding/onboarding_5.1.jpg',
        title: t('onboarding.stats.step1.title'),
        description: t('onboarding.stats.step1.description'),
      },
      {
        image: '/onboarding/onboarding_5.2.jpg',
        title: t('onboarding.stats.step2.title'),
        description: t('onboarding.stats.step2.description'),
      },
    ],
  },
  journal: {
    title: t('onboarding.journal.title'),
    steps: [
      {
        image: '/onboarding/onboarding_6.1.jpg',
        title: t('onboarding.journal.step1.title'),
        description: t('onboarding.journal.step1.description'),
      },
      {
        image: '/onboarding/onboarding_6.2.jpg',
        title: t('onboarding.journal.step2.title'),
        description: t('onboarding.journal.step2.description'),
      },
      {
        image: '/onboarding/onboarding_6.3.jpg',
        title: t('onboarding.journal.step3.title'),
        description: t('onboarding.journal.step3.description'),
      },
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
