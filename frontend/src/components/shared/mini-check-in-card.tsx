import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { useCheckInStore } from '@/stores/check-in.store'

import { CardSection } from './card-section'
import { Leaf } from './leaf'

type MiniCheckInCardProps = {
  title?: string
  description?: string
  className?: string
}

export const MiniCheckInCard = ({ title, description, className }: MiniCheckInCardProps) => {
  const resolvedTitle = title ?? t('checkIn.card.title')
  const resolvedDescription = description ?? t('checkIn.card.description')
  const openCheckIn = useCheckInStore.use.open()

  return (
    <CardSection className={cn('flex flex-col gap-4', className)} padding='md'>
      <Leaf variant={5} />
      <div>
        <h3 className='text-foreground text-sm font-semibold'>{resolvedTitle}</h3>
        <p className='text-muted-foreground/90 mt-2 text-sm leading-relaxed'>
          {resolvedDescription}
        </p>
      </div>
      <Button className='h-10 w-full rounded-full text-sm' onClick={() => openCheckIn()}>
        <PlusIcon className='size-4' />
        {t('checkIn.card.addAction')}
      </Button>
    </CardSection>
  )
}
