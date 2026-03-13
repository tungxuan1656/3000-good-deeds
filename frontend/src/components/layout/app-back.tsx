import { ArrowLeftIcon } from 'lucide-react'
import { useLocation } from 'react-router-dom'

import { useIsMobile } from '@/hooks/shared/use-mobile'
import { BOTTOM_TAB_ITEMS, PATHS } from '@/lib/constants'

export const AppBack = () => {
  const isMobile = useIsMobile()
  const path = useLocation().pathname

  if (
    !isMobile ||
    BOTTOM_TAB_ITEMS.map(({ path }) => path).includes(path) ||
    path === PATHS.LOGIN
  ) {
    return null
  }

  return (
    <button
      className='t-safe fixed left-3 rounded-full border border-black/5 bg-card p-2 shadow-sm'
      onClick={() => window.history.back()}>
      <ArrowLeftIcon className='size-5' />
    </button>
  )
}
