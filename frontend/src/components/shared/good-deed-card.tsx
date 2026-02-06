import { useCategories } from '@/hooks/api/use-categories'
import type { DeedDTO } from '@/types/api'

import { CardInlineSection } from './card-inline-section'

export const GoodDeedCard = ({ deed }: { deed: DeedDTO }) => {
  const { codeToCategoryMap } = useCategories()
  const meta = codeToCategoryMap[deed.categoryCode]

  return (
    <CardInlineSection>
      <div className='flex items-center gap-3 sm:gap-4'>
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${meta.style}`}>
          <img alt={meta.name} className='h-6 w-6' src={meta.icon} />
        </div>
        <div className='flex-1'>
          <p className='text-foreground text-base font-semibold'>{meta.name}</p>
          <p className='text-muted-foreground text-sm'>{deed.labels}</p>
        </div>
      </div>

      <p className='text-foreground text-sm leading-relaxed'>{deed.description}</p>
    </CardInlineSection>
  )
}
