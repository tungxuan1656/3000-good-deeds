import { t } from '@/lib/i18n'

import { Card } from '../ui'
import { LogoutButton } from './logout-button'

export const SessionCard = () => {
  return (
    <Card className='gap-4'>
      <div>
        <p className='text-foreground text-base font-semibold'>
          {t('settings.session.title')}
        </p>
        <p className='text-muted-foreground mt-1 text-sm'>
          {t('settings.session.description')}
        </p>
        <p className='text-muted-foreground mt-1 text-sm'>
          {t('settings.session.helper')}
        </p>
      </div>
      <LogoutButton
        className='border-border bg-card text-foreground hover:bg-accent h-11 w-full rounded-full border'
        variant='secondary'
      />
    </Card>
  )
}
