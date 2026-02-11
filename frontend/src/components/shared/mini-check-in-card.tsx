import { PlusIcon } from 'lucide-react'
import { useRef } from 'react'

import { CardSection } from '@/components/shared/card-section'
import { type CheckInDrawerHandle, CheckInSheet } from '@/components/shared/check-in-sheet'
import { GoodDeedCategoryMiniButton } from '@/components/shared/good-deed-category-button'
import { Button } from '@/components/ui/button'
import { useCategories } from '@/hooks/api/use-categories'
import { cn } from '@/lib/utils'

import Leaf from './leaf'

type MiniCheckInCardProps = {
  title?: string
  description?: string
  onOpenCheckIn?: (nextCategory?: string) => void
  className?: string
}

export const MiniCheckInCard = ({
  title = 'Việc thiện hôm nay',
  description = 'Bạn đã làm được điều gì hôm nay?',
  className,
}: MiniCheckInCardProps) => {
  const checkInRef = useRef<CheckInDrawerHandle>(null)
  const { data: categories } = useCategories()

  const openCheckIn = (nextCategory?: string) => {
    checkInRef.current?.open(nextCategory)
  }

  return (
    <CardSection className={cn('flex flex-col gap-4', className)} padding='md'>
      <Leaf variant={5} />
      <div>
        <h3 className='text-foreground text-sm font-semibold'>{title}</h3>
        <p className='text-muted-foreground/90 mt-2 text-sm leading-relaxed'>{description}</p>
      </div>
      <div className='flex gap-2'>
        {categories.map((category) => {
          return (
            <GoodDeedCategoryMiniButton
              key={category.code}
              category={category}
              onClick={() => openCheckIn(category.code)}
            />
          )
        })}
      </div>
      <Button className='h-10 w-full rounded-full text-sm' onClick={() => openCheckIn()}>
        <PlusIcon className='size-4' />
        Ghi nhận việc thiện
      </Button>
      <CheckInSheet ref={checkInRef} />
    </CardSection>
  )
}
