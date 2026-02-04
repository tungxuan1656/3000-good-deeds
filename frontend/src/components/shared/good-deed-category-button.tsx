import { cn } from '@/lib/utils'
import type { DeedCategoryDTO } from '@/types/api'

export const GoodDeedCategoryButton = ({
  category,
  ...props
}: {
  category: DeedCategoryDTO
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const className = category.style ?? 'bg-white/80 hover:bg-white'
  const icon = category.icon || undefined

  return (
    <button
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl border border-black/5 p-3 text-left transition-colors',
        className,
      )}
      type='button'
      {...props}>
      <div className='flex h-12 w-12 items-center justify-center rounded-2xl'>
        <img alt={category.name} className='size-10' src={icon} />
      </div>
      <div className='flex-1'>
        <p className='text-foreground text-base font-semibold'>{category.name}</p>
        {category.description && (
          <p className='text-muted-foreground text-sm leading-relaxed'>{category.description}</p>
        )}
      </div>
    </button>
  )
}

export const GoodDeedCategoryMiniButton = ({
  category,
  ...props
}: {
  category: DeedCategoryDTO
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const className = category.style ?? 'bg-white/80 hover:bg-white'
  const icon = category.icon || undefined

  return (
    <button
      className={cn(
        'flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-black/5 p-3 text-left transition-colors',
        className,
      )}
      type='button'
      {...props}>
      <div className='flex size-10 items-center justify-center rounded-2xl'>
        <img alt={category.name} className='size-8' src={icon} />
      </div>
      <div className=''>
        <p className='text-foreground text-center text-sm font-semibold'>{category.name}</p>
      </div>
    </button>
  )
}
