import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { t } from '@/lib/i18n'
import { useGoodDeedStore } from '@/stores/good-deed.store'

import { Card } from '../ui'

type MiniCheckInCardProps = {
  title?: string
  description?: string
  className?: string
}

export const MiniCheckInCard = ({
  title,
  description,
}: MiniCheckInCardProps) => {
  const resolvedTitle = title ?? t('checkIn.card.title')
  const resolvedDescription = description ?? t('checkIn.card.description')
  const openCreateDeed = useGoodDeedStore.use.openCreate()

  return (
    <Card className='space-y-3'>
      <div className='flex flex-col gap-1'>
        <h3 className='font-headline text-primary text-base italic md:text-lg'>
          {resolvedTitle}
        </h3>
        <p className='text-muted-foreground px-1 text-xs leading-relaxed font-light md:text-sm'>
          {resolvedDescription}
        </p>
      </div>
      <Button
        className='w-full rounded-full'
        size={'sm'}
        onClick={() => openCreateDeed()}>
        <PlusIcon className='size-4' />
        {t('checkIn.card.addAction')}
      </Button>
    </Card>
  )
}
