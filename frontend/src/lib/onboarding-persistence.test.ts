import { beforeEach, describe, expect, it, vi } from 'vitest'

import { markOnboardingAsSeen, shouldAutoOpenOnboarding } from './onboarding-persistence'

const STORAGE_KEY = 'onboarding.general.v1'

describe('onboarding persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns true for first-time users without a stored key', () => {
    expect(shouldAutoOpenOnboarding(localStorage, STORAGE_KEY)).toBe(true)
  })

  it('returns false when onboarding was already marked as seen', () => {
    localStorage.setItem(STORAGE_KEY, 'seen')

    expect(shouldAutoOpenOnboarding(localStorage, STORAGE_KEY)).toBe(false)
  })

  it('stores seen marker on close', () => {
    const success = markOnboardingAsSeen(localStorage, STORAGE_KEY)

    expect(success).toBe(true)
    expect(localStorage.getItem(STORAGE_KEY)).toBe('seen')
  })

  it('fails safely when storage access throws', () => {
    const throwingStorage = {
      getItem: vi.fn(() => {
        throw new Error('storage blocked')
      }),
      setItem: vi.fn(() => {
        throw new Error('storage blocked')
      }),
    }

    expect(shouldAutoOpenOnboarding(throwingStorage, STORAGE_KEY)).toBe(false)
    expect(markOnboardingAsSeen(throwingStorage, STORAGE_KEY)).toBe(false)
  })
})
