import { LeafIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { t } from '@/lib/i18n'

const breadcrumbLabels: Record<string, string> = {
  timeline: t('breadcrumbs.timeline'),
  handbook: t('breadcrumbs.handbook'),
  progress: t('breadcrumbs.progress'),
  more: t('breadcrumbs.more'),
  quote: t('breadcrumbs.quote'),
  journal: t('breadcrumbs.journal'),
  history: t('breadcrumbs.history'),
}

export const HeaderBrand = () => {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  const lastSegment = segments[segments.length - 1]

  const label = lastSegment
    ? (breadcrumbLabels[lastSegment] ?? decodeURIComponent(lastSegment))
    : t('breadcrumbs.home')

  return (
    <Link
      className='flex items-center gap-4 transition-opacity duration-200 hover:opacity-80 focus:outline-none'
      to='/'>
      <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl'>
        <LeafIcon className='text-primary h-6 w-6 fill-current' />
      </div>
      <span className='font-headline text-foreground text-2xl font-medium tracking-tight sm:text-3xl'>
        {label}
      </span>
    </Link>
  )
}
