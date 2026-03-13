import { CardSection } from '@/components/shared'
import { t } from '@/lib/i18n'

import { LogoutButton } from './logout-button'

export const SessionCard = () => {
  return (
    <CardSection className='gap-4'>
      <div>
        <p className='text-foreground text-base font-semibold'>{t('settings.session.title')}</p>
        <p className='text-muted-foreground mt-1 text-sm'>{t('settings.session.description')}</p>
        <p className='text-muted-foreground mt-1 text-sm'>{t('settings.session.helper')}</p>
      </div>
      <LogoutButton
        className='text-foreground h-11 w-full rounded-full border border-black/5 bg-white hover:bg-white/80'
        variant='secondary'
      />
    </CardSection>
  )
}
