import { Plus } from 'lucide-react'

import { MobileContainer } from '@/components/layout/mobile-container'
import { Button } from '@/components/ui/button'

const HomePage = () => {
  return (
    <MobileContainer>
      {/* Header */}
      <header className='flex items-center justify-between px-6 pt-8 pb-4'>
        <div className='flex flex-col'>
          <span className='text-muted-foreground text-sm font-medium'>Chủ nhật, 15/10</span>
          <h1 className='text-foreground mt-1 text-2xl font-semibold'>Chào Tùng,</h1>
        </div>
        <div className='bg-primary/20 text-primary flex h-10 w-10 items-center justify-center rounded-full font-bold'>
          T
        </div>
      </header>

      {/* Quote Section */}
      <section className='px-6 py-4'>
        <div className='group bg-surface relative overflow-hidden rounded-2xl border border-black/5 p-5 shadow-sm'>
          <div className='bg-primary/30 absolute top-0 left-0 h-full w-1' />
          <p className='text-foreground/80 leading-relaxed font-medium italic'>
            "Hạnh phúc không phải là đích đến, mà là con đường chúng ta đang đi."
          </p>
          <div className='mt-4 flex justify-end'>
            <span className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
              Thích Nhất Hạnh
            </span>
          </div>
        </div>
      </section>

      {/* Main Action - FAB style but inline for now or fixed bottom */}
      <div className='fixed right-6 bottom-6 z-50 md:hidden'>
        <Button
          className='bg-primary hover:bg-primary/90 h-14 w-14 rounded-full text-white shadow-lg'
          size='icon'>
          <Plus className='h-6 w-6' />
        </Button>
      </div>

      {/* Desktop FAB equivalent / Centered Action */}
      <div className='flex justify-center px-6 py-4'>
        <Button className='bg-primary hover:bg-primary/90 h-12 w-full rounded-full text-base font-medium text-white shadow-sm'>
          <Plus className='mr-2 h-5 w-5' />
          Ghi nhận việc thiện
        </Button>
      </div>

      {/* Stats / Journey Preview */}
      <section className='flex-1 px-6 py-4'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Hôm nay</h2>
          <Button className='text-muted-foreground' size='sm' variant='ghost'>
            Xem tất cả
          </Button>
        </div>

        {/* Empty State / List */}
        <div className='flex flex-col gap-4 py-10 text-center opacity-60'>
          <div className='bg-muted mx-auto mb-3 h-16 w-16 rounded-full' />
          <p className='text-muted-foreground text-sm'>
            Chưa có việc thiện nào hôm nay.
            <br />
            Hãy gieo một hạt giống lành!
          </p>
        </div>
      </section>
    </MobileContainer>
  )
}

export default HomePage
