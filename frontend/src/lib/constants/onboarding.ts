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
