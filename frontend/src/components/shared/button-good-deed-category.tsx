export const ButtonGoodDeedCategory = ({
  variant,
  ...props
}: {
  variant: 'body' | 'speech' | 'mind'
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  if (variant === 'speech') {
    return (
      <button
        className='bg-speech/20 hover:bg-speech/25 flex w-full items-center gap-4 rounded-2xl border border-black/5 px-4 py-4 text-left transition-colors'
        type='button'
        {...props}>
        <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 shadow-sm'>
          <img alt='Khẩu' className='h-8 w-8' src='/icons/icon_khau.png' />
        </div>
        <div className='flex-1'>
          <p className='text-foreground text-base font-semibold'>Khẩu</p>
          <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>
            Lời nói hiền lành & nâng đỡ người khác
          </p>
        </div>
      </button>
    )
  }
  if (variant === 'mind') {
    return (
      <button
        className='bg-mind/20 hover:bg-mind/25 flex w-full items-center gap-4 rounded-2xl border border-black/5 px-4 py-4 text-left transition-colors'
        type='button'
        {...props}>
        <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 shadow-sm'>
          <img alt='Ý' className='h-8 w-8' src='/icons/icon_y.png' />
        </div>
        <div className='flex-1'>
          <p className='text-foreground text-base font-semibold'>Ý</p>
          <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>
            Suy nghĩ tốt đẹp & thiện lành
          </p>
        </div>
      </button>
    )
  }

  return (
    <button
      className='bg-body/20 hover:bg-body/25 flex w-full items-center gap-4 rounded-2xl border border-black/5 px-4 py-4 text-left transition-colors'
      type='button'
      {...props}>
      <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 shadow-sm'>
        <img alt='Thân' className='h-8 w-8' src='/icons/icon_than.png' />
      </div>
      <div className='flex-1'>
        <p className='text-foreground text-base font-semibold'>Thân</p>
        <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>
          Hỗ trợ, giúp đỡ, hành động thiện lành
        </p>
      </div>
    </button>
  )
}
