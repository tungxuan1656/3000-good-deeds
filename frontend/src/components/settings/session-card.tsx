import { t } from '@/lib/i18n'

import { Card } from '../ui'
import { LogoutButton } from './logout-button'

export const SessionCard = () => {
  return (
    <Card padding='sm'>
      <h4 className='text-foreground text-base font-semibold md:text-xl'>
        {t('settings.session.title')}
      </h4>
      <p className='text-muted-foreground mt-1 text-sm'>
        {t('settings.session.helper')}
      </p>
      <div className='flex justify-end'>
        <LogoutButton
          className='border-border bg-card text-foreground hover:bg-accent mt-2 h-9 border'
          variant='secondary'
        />
      </div>
    </Card>
  )
}
