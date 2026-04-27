'use client'

import { ArrowLeftIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { useIsMobile } from '@/hooks/shared/use-mobile'
import { BOTTOM_TAB_ITEMS, PATHS } from '@/lib/constants'

export const AppBack = () => {
  const isMobile = useIsMobile()
  const path = usePathname()

  if (
    !isMobile ||
    BOTTOM_TAB_ITEMS.map(({ path }) => path).includes(path) ||
    path === PATHS.LOGIN
  ) {
    return null
  }

  return (
    <button
      className='t-safe bg-card border-border/45 fixed left-3 rounded-full border p-2 shadow-sm'
      type='button'
      onClick={() => window.history.back()}>
      <ArrowLeftIcon className='size-5' />
    </button>
  )
}
