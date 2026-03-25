import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { INFO_COPY } from '@/lib/constants/info-copy'
import { t } from '@/lib/i18n'
import { useCheckInStore } from '@/stores/check-in.store'

import { Card } from '../ui'
import { InfoButton } from './info-button'
import { Leaf } from './leaf'

export function CheckInCard() {
  const openCheckIn = useCheckInStore.use.open()

  return (
    <Card>
      <Leaf className='h-32 w-32 rotate-180' position='top-right' variant={4} />
      <div className='flex flex-col gap-4'>
        <div>
          <div className='flex items-center justify-between gap-2'>
            <h2 className='text-foreground text-lg font-semibold'>
              {t('checkIn.card.title')}
            </h2>
            <InfoButton
              description={INFO_COPY.deeds.description}
              title={INFO_COPY.deeds.title}
            />
          </div>
          <p className='text-muted-foreground/90 mt-2 text-sm leading-relaxed'>
            {t('checkIn.card.description')}
          </p>
        </div>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
          <Button onClick={() => openCheckIn()}>
            <PlusIcon className='size-4' />
            {t('checkIn.card.addAction')}
          </Button>
        </div>
      </div>
    </Card>
  )
}
