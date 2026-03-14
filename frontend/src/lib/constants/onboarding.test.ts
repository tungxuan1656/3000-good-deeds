import { describe, expect, it } from 'vitest'

import { ONBOARDING_CONTENT, ONBOARDING_KEYS } from './onboarding'

describe('onboarding constants', () => {
  it('keeps only the general onboarding flow', () => {
    expect(Object.keys(ONBOARDING_CONTENT)).toEqual(['general'])
    expect(Object.keys(ONBOARDING_KEYS)).toEqual(['general'])
  })

  it('defines the expected general onboarding assets', () => {
    expect(ONBOARDING_CONTENT.general.steps).toHaveLength(4)

    expect(ONBOARDING_CONTENT.general.steps.map((step) => step.image)).toEqual([
      '/onboarding/onboarding_1.1.jpg',
      '/onboarding/onboarding_1.2.jpg',
      '/onboarding/onboarding_1.3.jpg',
      '/onboarding/onboarding_1.4.jpg',
    ])
  })
})
