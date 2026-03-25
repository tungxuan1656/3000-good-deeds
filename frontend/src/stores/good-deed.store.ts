import { create } from 'zustand'

import type { DeedDTO } from '@/types/api'

import { createSelectors } from './types'

interface GoodDeedState {
  isOpen: boolean
  mode: 'create' | 'edit'
  editingDeed: DeedDTO | null
  openCreate: () => void
  openEdit: (deed: DeedDTO) => void
  close: () => void
  reset: () => void
}

const useGoodDeedStoreBase = create<GoodDeedState>((set) => ({
  isOpen: false,
  mode: 'create',
  editingDeed: null,
  openCreate: () =>
    set({
      isOpen: true,
      mode: 'create',
      editingDeed: null,
    }),
  openEdit: (deed) =>
    set({
      isOpen: true,
      mode: 'edit',
      editingDeed: deed,
    }),
  close: () => set({ isOpen: false }),
  reset: () =>
    set({
      isOpen: false,
      mode: 'create',
      editingDeed: null,
    }),
}))

export const useGoodDeedStore = createSelectors(useGoodDeedStoreBase)
