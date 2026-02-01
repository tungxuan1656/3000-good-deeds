import { PlusIcon, SparklesIcon } from 'lucide-react'

import { CardSection } from '@/components/shared/card-section'
import Leaf from '@/components/shared/leaf'
import { Button } from '@/components/ui/button'

const HomePage = () => {
  return (
    <div className='grid gap-8 lg:grid-cols-[1fr_320px]'>
      {/* Main column */}
      <div className='flex flex-col gap-4'>
        {/* Header */}
        <CardSection as='header'>
          <Leaf position='top-left' variant={1} />
          <p className='text-muted-foreground/70 text-xs font-semibold tracking-wider uppercase'>
            Chủ nhật, 15/10
          </p>
          <h1 className='text-foreground mt-2 text-2xl font-semibold tracking-tight sm:text-3xl'>
            Hôm nay của bạn
          </h1>
          <p className='text-muted-foreground/90 mt-3 max-w-xl text-base leading-relaxed'>
            Hôm nay bạn muốn ghi lại điều gì để nuôi dưỡng lòng biết ơn?
          </p>
        </CardSection>

        {/* Quote Section */}
        <CardSection>
          <Leaf className='opacity-30' position='top-right' variant={2} />
          <div className='flex items-start gap-4'>
            <div className='bg-primary/60 mt-1 h-12 w-1 rounded-full' />
            <div>
              <div className='text-muted-foreground/80 mb-3 flex items-center gap-2 text-xs font-semibold'>
                <SparklesIcon className='text-accent h-4 w-4' />
                Pháp ngữ mỗi ngày
              </div>
              <p className='text-foreground/85 text-lg leading-relaxed font-medium italic'>
                “Mỗi việc thiện nhỏ đều gieo một hạt giống.”
              </p>
              <div className='text-muted-foreground/60 mt-3 flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] uppercase'>
                Lời nhắc từ thiện tâm
              </div>
            </div>
          </div>
        </CardSection>

        {/* Quick check-in */}
        <CardSection>
          <Leaf className='h-32 w-32' position='bottom-left' variant={3} />
          <div className='flex flex-col gap-4'>
            <div>
              <h2 className='text-foreground text-lg font-semibold'>Việc thiện hôm nay</h2>
              <p className='text-muted-foreground/90 mt-2 text-sm leading-relaxed'>
                Bạn đã thực hành điều gì hôm nay?
              </p>
            </div>
            <div className='relative grid gap-3 sm:grid-cols-3'>
              <button
                className='group bg-body/25 text-foreground hover:bg-body/35 flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border border-black/5 px-3 py-4 text-sm font-medium transition-colors'
                type='button'>
                <img alt='Thân' className='h-10 w-10' src='/icons/icon_than.png' />
                Thân
              </button>
              <button
                className='group bg-speech/25 text-foreground hover:bg-speech/35 flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border border-black/5 px-3 py-4 text-sm font-medium transition-colors'
                type='button'>
                <img alt='Khẩu' className='h-10 w-10' src='/icons/icon_khau.png' />
                Khẩu
              </button>
              <button
                className='group bg-mind/25 text-foreground hover:bg-mind/35 flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border border-black/5 px-3 py-4 text-sm font-medium transition-colors'
                type='button'>
                <img alt='Ý' className='h-10 w-10' src='/icons/icon_y.png' />Ý
              </button>
            </div>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
              <Button className='bg-primary hover:bg-primary/90 hidden h-12 w-full rounded-full text-base font-medium text-white sm:inline-flex sm:w-auto'>
                <PlusIcon className='mr-2 h-5 w-5' />
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

        {/* Progress */}
        <CardSection>
          <Leaf className='h-32 w-32' position='bottom-right' variant={1} />
          <div className='mb-4 flex items-center justify-between'>
            <div>
              <h2 className='text-foreground text-lg font-semibold'>Chuỗi thiện lành</h2>
              <p className='text-muted-foreground mt-1 text-sm'>5 ngày liên tiếp</p>
            </div>
            <span className='text-muted-foreground text-xs'>Mục tiêu tuần</span>
          </div>
          <div className='bg-muted h-2.5 w-full rounded-full'>
            <div className='bg-primary/70 h-2.5 w-[70%] rounded-full' />
          </div>
          <div className='text-muted-foreground/90 mt-3 text-xs'>
            Còn 2 ngày nữa để hoàn tất mục tiêu tuần này.
          </div>
        </CardSection>

        {/* Today Section */}
        <CardSection>
          <Leaf position='top-left' variant={4} />
          <div className='mb-4 flex items-end justify-between'>
            <h2 className='text-foreground text-lg font-semibold'>Hôm nay</h2>
            <Button
              className='text-muted-foreground hover:text-primary h-auto p-0 text-xs font-medium hover:bg-transparent'
              variant='ghost'>
              Xem tất cả
            </Button>
          </div>

          <div className='flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-black/10 bg-white/60 px-4 py-10 text-center'>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              Chưa có việc thiện nào hôm nay.
              <br />
              Hãy gieo một hạt giống lành!
            </p>
            <Button className='bg-secondary text-foreground hover:bg-secondary/80 h-10 rounded-full text-sm font-medium'>
              Gợi ý điều nhỏ để bắt đầu
            </Button>
          </div>
        </CardSection>
      </div>

      {/* Side column */}
      <aside className='flex flex-col gap-4'>
        <CardSection padding='md'>
          <h3 className='text-foreground text-base font-semibold'>Nhịp điệu trong tuần</h3>
          <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
            4/7 ngày đã gieo hạt. Hãy giữ nhịp nhẹ nhàng.
          </p>
          <div className='mt-4 flex gap-2'>
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => (
              <div
                key={day}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${
                  index < 4 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                {day}
              </div>
            ))}
          </div>
        </CardSection>

        <CardSection padding='md'>
          <h3 className='text-foreground text-base font-semibold'>Nhắc nhở dịu nhẹ</h3>
          <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
            “Một điều tử tế mỗi ngày, tâm an yên hơn mỗi tối.”
          </p>
          <Button className='text-foreground mt-4 h-11 w-full rounded-full border border-black/5 bg-white text-sm font-medium hover:bg-white/80'>
            Thiết lập nhắc nhở
          </Button>
        </CardSection>
      </aside>

      {/* Floating Action Button (Mobile Only) */}
      <div className='pointer-events-none fixed right-5 bottom-5 z-50 md:hidden'>
        <Button
          aria-label='Ghi nhận việc thiện'
          className='bg-primary hover:bg-primary/90 pointer-events-auto h-14 w-14 rounded-full text-white shadow-xl'
          size='icon'>
          <PlusIcon className='h-6 w-6' />
        </Button>
      </div>
    </div>
  )
}

export default HomePage
