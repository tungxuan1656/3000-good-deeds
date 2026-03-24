import { LeafIcon } from 'lucide-react'

import { t } from '@/lib/i18n'

interface AuthBrandProps {
  description?: string
}

export const AuthBrand = ({ description }: AuthBrandProps) => {
  return (
    <div className='mt-10 text-center'>
      <div className='bg-surface-container-high mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full'>
        <LeafIcon className='text-primary h-8 w-8 fill-current' />
      </div>
      <h1 className='font-headline text-primary mb-3 text-4xl font-bold'>
        {t('auth.login.brandName')}
      </h1>
      <p className='text-on-surface-variant text-sm font-light tracking-wide italic'>
        {description || t('auth.login.heroDescription')}
      </p>
    </div>
  )
}
