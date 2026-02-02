import { cn } from '@/lib/utils'

const categories = {
  body: {
    classname: 'bg-body/20 hover:bg-body/25',
    icon: '/icons/icon_than.png',
    label: 'Thân',
    description: 'Hỗ trợ, giúp đỡ, hành động thiện lành',
  },
  speech: {
    classname: 'bg-speech/20 hover:bg-speech/25',
    icon: '/icons/icon_khau.png',
    label: 'Khẩu',
    description: 'Lời nói hiền lành & nâng đỡ người khác',
  },
  mind: {
    classname: 'bg-mind/20 hover:bg-mind/25',
    icon: '/icons/icon_y.png',
    label: 'Ý',
    description: 'Suy nghĩ tốt đẹp & thiện lành',
  },
}

export const ButtonGoodDeedCategory = ({
  variant,
  ...props
}: {
  variant: 'body' | 'speech' | 'mind'
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl border border-black/5 p-3 text-left transition-colors',
        categories[variant].classname,
      )}
      type='button'
      {...props}>
      <div className='flex h-12 w-12 items-center justify-center rounded-2xl'>
        <img alt={categories[variant].label} className='size-10' src={categories[variant].icon} />
      </div>
      <div className='flex-1'>
        <p className='text-foreground text-base font-semibold'>{categories[variant].label}</p>
        <p className='text-muted-foreground text-sm leading-relaxed'>
          {categories[variant].description}
        </p>
      </div>
    </button>
  )
}

export const MiniButtonGoodDeedCategory = ({
  variant,
  ...props
}: {
  variant: 'body' | 'speech' | 'mind'
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        'flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-black/5 p-3 text-left transition-colors',
        categories[variant].classname,
      )}
      type='button'
      {...props}>
      <div className='flex size-10 items-center justify-center rounded-2xl'>
        <img alt={categories[variant].label} className='size-8' src={categories[variant].icon} />
      </div>
      <div className=''>
        <p className='text-foreground text-base font-semibold'>{categories[variant].label}</p>
      </div>
    </button>
  )
}
