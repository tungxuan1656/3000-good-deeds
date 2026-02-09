import { useIsMobile } from '@/hooks/use-mobile'

import MenuDropdown from '../shared/menu-dropdown'
import { HeaderBreadcrumbs } from './header-breadcrumbs'

export const AppHeader = () => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <div className='h-2' />
  }

  return (
    <header className='flex items-center gap-4'>
      <div className='md:hidden'>
        <MenuDropdown />
      </div>
      <HeaderBreadcrumbs />
    </header>
  )
}
