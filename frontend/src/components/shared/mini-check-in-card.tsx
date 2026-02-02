import { PlusIcon } from 'lucide-react'
import { useRef } from 'react'

import { MiniButtonGoodDeedCategory } from '@/components/shared/button-good-deed-category'
import { CardSection } from '@/components/shared/card-section'
import CheckInDrawer, {
  type CheckInCategory,
  type CheckInDrawerHandle,
} from '@/components/shared/check-in-drawer'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type MiniCheckInCardProps = {
  title?: string
  description?: string
  onOpenCheckIn?: (nextCategory?: CheckInCategory) => void
  className?: string
}

export const MiniCheckInCard = ({
  title = 'Việc thiện hôm nay',
  description = 'Bạn đã thực hành điều gì hôm nay?',
  className,
}: MiniCheckInCardProps) => {
  const checkInRef = useRef<CheckInDrawerHandle>(null)

  const openCheckIn = (nextCategory?: CheckInCategory) => {
    checkInRef.current?.open(nextCategory)
  }

  return (
    <CardSection className={cn('flex flex-col gap-4', className)} padding='md'>
      <div>
        <h3 className='text-foreground text-sm font-semibold'>{title}</h3>
        <p className='text-muted-foreground/90 mt-2 text-xs leading-relaxed'>{description}</p>
      </div>
      <div className='flex gap-2'>
        <MiniButtonGoodDeedCategory variant='body' onClick={() => openCheckIn('body')} />
        <MiniButtonGoodDeedCategory variant='speech' onClick={() => openCheckIn('speech')} />
        <MiniButtonGoodDeedCategory variant='mind' onClick={() => openCheckIn('mind')} />
      </div>
      <Button className='h-10 w-full rounded-full text-sm' onClick={() => openCheckIn()}>
        <PlusIcon className='size-4' />
        Ghi nhận việc thiện
      </Button>
      <CheckInDrawer ref={checkInRef} />
    </CardSection>
  )
}
