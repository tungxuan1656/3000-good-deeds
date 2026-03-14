import { t } from '@/lib/i18n'

// Language-change in this app triggers a full page reload, so module-level t() calls are safe.
type OnboardingFlowKey = 'general'

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
} satisfies Record<OnboardingFlowKey, OnboardingFlow>

export const ONBOARDING_KEYS = {
  general: 'onboarding.general.v1',
}
