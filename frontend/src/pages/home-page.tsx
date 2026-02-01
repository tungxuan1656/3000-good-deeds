import { MenuIcon, PlusIcon, SparklesIcon, UserRoundIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

const HomePage = () => {
  return (
    <div className='bg-background min-h-screen pb-24'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-6 sm:px-6 lg:px-8'>
        {/* Top bar */}
        <div className='flex items-center justify-between'>
          <Button
            aria-label='Mở menu'
            className='text-foreground h-11 w-11 rounded-full bg-white/80 shadow-sm hover:bg-white'
            size='icon'
            variant='ghost'>
            <MenuIcon className='h-5 w-5' />
          </Button>
          <div className='flex items-center gap-2 text-right'>
            <div className='text-muted-foreground hidden text-xs font-medium sm:block'>
              Chủ nhật, 15/10
            </div>
            <Button
              aria-label='Hồ sơ'
              className='text-foreground h-11 w-11 rounded-full bg-white/80 shadow-sm hover:bg-white'
              size='icon'
              variant='ghost'>
              <UserRoundIcon className='h-5 w-5' />
            </Button>
          </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-[1fr_320px]'>
          {/* Main column */}
          <div className='flex flex-col gap-6'>
            {/* Header */}
            <header className='rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm'>
              <p className='text-muted-foreground/70 text-xs font-semibold tracking-wider uppercase'>
                Chủ nhật, 15/10
              </p>
              <h1 className='text-foreground mt-2 text-3xl font-semibold tracking-tight'>
                Chào Tùng,
              </h1>
              <p className='text-muted-foreground mt-3 max-w-xl text-base leading-relaxed'>
                Hôm nay bạn muốn ghi lại điều gì để nuôi dưỡng lòng biết ơn?
              </p>
              <div className='text-muted-foreground mt-5 flex flex-wrap gap-2 text-xs font-medium'>
                <span className='rounded-full border border-black/5 bg-white px-3 py-1'>
                  7 ngày liên tiếp
                </span>
                <span className='rounded-full border border-black/5 bg-white px-3 py-1'>
                  12 việc thiện tháng này
                </span>
              </div>
            </header>

            {/* Quote Section */}
            <section className='rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm'>
              <div className='flex items-start gap-4'>
                <div className='bg-primary/60 mt-1 h-12 w-1 rounded-full' />
                <div>
                  <p className='text-foreground/80 text-lg leading-relaxed italic'>
                    "Hạnh phúc không phải là đích đến, mà là con đường chúng ta đang đi."
                  </p>
                  <div className='text-muted-foreground/60 mt-4 flex items-center gap-2 text-[10px] font-semibold tracking-[0.3em] uppercase'>
                    <SparklesIcon className='h-3 w-3' />
                    Thích nhất hạnh
                  </div>
                </div>
              </div>
            </section>

            {/* Main Action */}
            <section className='rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm'>
              <div className='flex flex-col gap-4'>
                <div>
                  <h2 className='text-foreground text-lg font-semibold'>Ghi nhận hôm nay</h2>
                  <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
                    Chỉ cần một dòng ngắn, bạn đã gieo thêm một hạt giống lành.
                  </p>
                </div>
                <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                  <Button className='bg-primary hover:bg-primary/90 h-12 w-full rounded-full text-base font-medium text-white sm:w-auto'>
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
            </section>

            {/* Today Section */}
            <section className='rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm'>
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
            </section>
          </div>

          {/* Side column */}
          <aside className='flex flex-col gap-6'>
            <section className='rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm'>
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
            </section>

            <section className='rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm'>
              <h3 className='text-foreground text-base font-semibold'>Nhắc nhở dịu nhẹ</h3>
              <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
                “Một điều tử tế mỗi ngày, tâm an yên hơn mỗi tối.”
              </p>
              <Button className='text-foreground mt-4 h-11 w-full rounded-full border border-black/5 bg-white text-sm font-medium hover:bg-white/80'>
                Thiết lập nhắc nhở
              </Button>
            </section>
          </aside>
        </div>
      </div>

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
