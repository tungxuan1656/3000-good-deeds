'use client'

import Link from 'next/link'

import { PATHS } from '@/lib/constants'
import { t } from '@/lib/i18n'
import { useAuthStore } from '@/stores/auth.store'

import { Card } from '../ui'
import { Button } from '../ui/button'

export const ReminderSuggestCard = () => {
  const enable = useAuthStore.use.user()?.reminderEnabled
  if (enable) {
    return null
  }

  return (
    <Card padding='md'>
      <h3 className='text-foreground text-base font-semibold'>
        {t('reminder.card.title')}
      </h3>
      <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
        {t('reminder.card.quote')}
      </p>
      <Link href={PATHS.MORE}>
        <Button className='text-foreground bg-card hover:bg-card/80 border-border/45 mt-4 h-11 w-full rounded-full border text-sm font-medium'>
          {t('reminder.card.action')}
        </Button>
      </Link>
    </Card>
  )
}
