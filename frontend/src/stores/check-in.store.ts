import { create } from 'zustand'

import { createSelectors } from './types'

interface CheckInState {
  isOpen: boolean
  open: () => void
  close: () => void
}

const useCheckInStoreBase = create<CheckInState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))

export const useCheckInStore = createSelectors(useCheckInStoreBase)
