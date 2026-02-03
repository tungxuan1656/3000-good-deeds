import { CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export const GoodDeedCategoryButton = ({
  variant,
  ...props
}: {
  variant: 'body' | 'speech' | 'mind'
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl border border-black/5 p-3 text-left transition-colors',
        CATEGORIES[variant].classname,
      )}
      type='button'
      {...props}>
      <div className='flex h-12 w-12 items-center justify-center rounded-2xl'>
        <img alt={CATEGORIES[variant].label} className='size-10' src={CATEGORIES[variant].icon} />
      </div>
      <div className='flex-1'>
        <p className='text-foreground text-base font-semibold'>{CATEGORIES[variant].label}</p>
        <p className='text-muted-foreground text-sm leading-relaxed'>
          {CATEGORIES[variant].description}
        </p>
      </div>
    </button>
  )
}

export const GoodDeedCategoryMiniButton = ({
  variant,
  ...props
}: {
  variant: 'body' | 'speech' | 'mind'
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        'flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-black/5 p-3 text-left transition-colors',
        CATEGORIES[variant].classname,
      )}
      type='button'
      {...props}>
      <div className='flex size-10 items-center justify-center rounded-2xl'>
        <img alt={CATEGORIES[variant].label} className='size-8' src={CATEGORIES[variant].icon} />
      </div>
      <div className=''>
        <p className='text-foreground text-base font-semibold'>{CATEGORIES[variant].label}</p>
      </div>
    </button>
  )
}
