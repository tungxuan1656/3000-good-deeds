import { PlusIcon } from 'lucide-react'
import { useRef } from 'react'

import { useCategories } from '@/hooks/api/use-categories'

import { Button } from '../ui/button'
import { CardSection } from './card-section'
import { CheckInDrawer, type CheckInDrawerHandle } from './check-in-drawer'
import { GoodDeedCategoryButton } from './good-deed-category-button'
import Leaf from './leaf'

export function CheckInCard() {
  const checkInRef = useRef<CheckInDrawerHandle>(null)
  const { data: categories } = useCategories()

  const openCheckIn = (nextCategory?: string) => {
    checkInRef.current?.open(nextCategory)
  }

  return (
    <CardSection>
      <CheckInDrawer ref={checkInRef} />
      <Leaf className='h-32 w-32' position='bottom-left' variant={3} />
      <div className='flex flex-col gap-4'>
        <div>
          <h2 className='text-foreground text-lg font-semibold'>Việc thiện hôm nay</h2>
          <p className='text-muted-foreground/90 mt-2 text-sm leading-relaxed'>
            Bạn đã thực hành điều gì hôm nay?
          </p>
        </div>
        <div className='relative flex flex-col gap-3'>
          {categories.map((category) => {
            return (
              <GoodDeedCategoryButton
                key={category.code}
                category={category}
                onClick={() => openCheckIn(category.code)}
              />
            )
          })}
        </div>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
          <Button onClick={() => openCheckIn()}>
            <PlusIcon className='size-5' />
            Ghi nhận việc thiện
          </Button>
          <Button
            className='text-muted-foreground hover:text-foreground h-11 w-full justify-center rounded-full text-sm sm:w-auto'
            variant='ghost'>
            Để sau
          </Button>
        </div>
      </div>
    </CardSection>
  )
}
