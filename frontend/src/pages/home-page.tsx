import { Plus } from 'lucide-react'

import { MobileContainer } from '@/components/layout/mobile-container'
import { Button } from '@/components/ui/button'

const HomePage = () => {
  return (
    <MobileContainer className='pb-20'>
      {/* Header */}
      <header className='flex flex-col px-6 pt-12 pb-6'>
        <span className='text-muted-foreground/60 text-xs font-semibold tracking-wider uppercase'>
          Chủ nhật, 15/10
        </span>
        <h1 className='text-foreground mt-1 font-sans text-3xl font-bold tracking-tight'>
          Chào Tùng,
        </h1>
      </header>

      {/* Quote Section */}
      <section className='px-6 py-2'>
        <div className='group relative overflow-hidden rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-all hover:shadow-md'>
          {/* Green accent line */}
          <div className='bg-primary/60 absolute top-0 left-0 h-full w-1.5' />

          <div className='pl-2'>
            <p className='text-foreground/80 font-sans text-lg leading-relaxed italic'>
              "Hạnh phúc không phải là đích đến, mà là con đường chúng ta đang đi."
            </p>
            <div className='mt-4 flex justify-end'>
              <span className='text-muted-foreground/50 text-[10px] font-bold tracking-widest uppercase'>
                THÍCH NHẤT HẠNH
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Action */}
      <div className='px-6 py-8'>
        <Button className='bg-primary shadow-primary/20 hover:bg-primary/90 h-14 w-full rounded-full text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]'>
          <Plus className='mr-2 h-5 w-5' />
          Ghi nhận việc thiện
        </Button>
      </div>

      {/* Stats / Journey Preview */}
      <section className='flex-1 px-6'>
        <div className='mb-4 flex items-end justify-between'>
          <h2 className='text-foreground text-lg font-bold'>Hôm nay</h2>
          <Button
            className='text-muted-foreground hover:text-primary h-auto p-0 text-xs font-medium hover:bg-transparent'
            variant='ghost'>
            Xem tất cả
          </Button>
        </div>

        {/* Empty State / List */}
        <div className='flex flex-col items-center justify-center gap-4 py-12 opacity-60'>
          <p className='text-muted-foreground text-center text-sm leading-loose font-medium'>
            Chưa có việc thiện nào hôm nay.
            <br />
            Hãy gieo một hạt giống lành!
          </p>
        </div>
      </section>

      {/* Floating Action Button (Mobile Only - Scroll optimized) */}
      <div className='pointer-events-none fixed right-6 bottom-6 z-50 md:hidden'>
        <Button
          className='bg-primary hover:bg-primary/90 pointer-events-auto h-14 w-14 rounded-full text-white shadow-xl'
          size='icon'>
          <Plus className='h-6 w-6' />
        </Button>
      </div>
    </MobileContainer>
  )
}

export default HomePage
