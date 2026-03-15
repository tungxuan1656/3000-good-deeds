import { describe, expect, it } from 'vitest'

import vi from './vi.json'

describe('vi locale integrity', () => {
  it('contains timeline info copy for the new timeline info button', () => {
    expect(vi.info.timeline.title).toBeTruthy()
    expect(vi.info.timeline.description).toBeTruthy()
  })

  it('keeps only dialog + general sections in onboarding locale', () => {
    expect(Object.keys(vi.onboarding)).toEqual(['dialog', 'general'])
  })

  it('does not contain category-based deed metadata', () => {
    expect(vi).not.toHaveProperty('categories')
    expect(vi.suggestActs).not.toHaveProperty('categories')
  })
})
