import { describe, expect, it } from 'vitest'

import { PATHS } from './paths'

describe('route paths', () => {
  it('maps the authenticated home screen to /home', () => {
    expect(PATHS.HOME).toBe('/home')
  })

  it('keeps the login and feature routes at top-level paths', () => {
    expect(PATHS.LOGIN).toBe('/login')
    expect(PATHS.TIMELINE).toBe('/timeline')
    expect(PATHS.HANDBOOK).toBe('/handbook')
    expect(PATHS.PROGRESS).toBe('/progress')
    expect(PATHS.MORE).toBe('/more')
  })
})
