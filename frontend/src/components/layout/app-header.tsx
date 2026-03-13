import { useIsMobile } from '@/hooks/shared/use-mobile'

import { HeaderBreadcrumbs } from './header-breadcrumbs'

export const AppHeader = () => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <div className='h-2' />
  }

  return (
    <header className='flex items-center gap-4'>
      <HeaderBreadcrumbs />
    </header>
  )
}
