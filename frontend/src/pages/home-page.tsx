import { MenuIcon, PlusIcon, SparklesIcon, UserRoundIcon, XIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className='bg-background min-h-screen pb-24'>
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='bg-primary/10 absolute -top-20 right-0 h-72 w-72 rounded-full blur-3xl' />
        <div className='bg-secondary/40 absolute top-40 left-6 h-48 w-48 rounded-full blur-3xl' />
      </div>

      <div className='relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-6 sm:px-6 lg:px-8'>
        {/* Menu drawer */}
        <div
          aria-modal='true'
          className={`fixed inset-0 z-40 transition-opacity duration-200 motion-reduce:transition-none ${
            isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          role='dialog'>
          <button
            aria-label='Đóng menu'
            className='absolute inset-0 bg-black/20 backdrop-blur-sm'
            type='button'
            onClick={() => setIsMenuOpen(false)}
          />
          <nav
            className={`absolute top-4 left-4 h-[calc(100%-2rem)] w-[min(320px,85vw)] rounded-3xl border border-black/5 bg-white/95 p-6 shadow-xl transition-transform duration-200 motion-reduce:transition-none ${
              isMenuOpen ? 'translate-x-0' : '-translate-x-6'
            }`}>
            <div className='mb-6 flex items-center justify-between'>
              <div>
                <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
                  Menu
                </p>
                <h2 className='text-foreground text-lg font-semibold'>Hành trình của bạn</h2>
              </div>
              <Button
                aria-label='Đóng menu'
                className='bg-muted/60 text-foreground hover:bg-muted h-10 w-10 rounded-full'
                size='icon'
                variant='ghost'
                onClick={() => setIsMenuOpen(false)}>
                <XIcon className='h-4 w-4' />
              </Button>
            </div>

            <div className='text-foreground flex flex-col gap-2 text-sm font-medium'>
              {['Trang chủ', 'Hành trình', 'Thống kê', 'Mục tiêu', 'Nội tâm', 'Cài đặt'].map(
                (item) => (
                  <button
                    key={item}
                    className='hover:bg-secondary/30 flex items-center justify-between rounded-2xl border border-black/5 bg-white px-4 py-3 text-left transition-colors'
                    type='button'>
                    <span>{item}</span>
                    <span className='text-muted-foreground'>›</span>
                  </button>
                ),
              )}
            </div>

            <div className='bg-secondary/30 text-muted-foreground mt-6 rounded-2xl border border-black/5 p-4 text-sm'>
              “Mỗi ngày một hạt giống lành.”
            </div>

            <Button className='text-muted-foreground mt-6 h-11 w-full rounded-full bg-white text-sm font-medium hover:bg-white/80'>
              Đăng xuất
            </Button>
          </nav>
        </div>

        {/* Top bar */}
        <div className='flex items-center justify-between'>
          <Button
            aria-label='Mở menu'
            className='text-foreground h-11 w-11 rounded-full bg-white/80 shadow-sm hover:bg-white'
            size='icon'
            variant='ghost'
            onClick={() => setIsMenuOpen(true)}>
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
                Hôm nay của bạn
              </h1>
              <p className='text-muted-foreground mt-3 max-w-xl text-base leading-relaxed'>
                Hôm nay bạn muốn ghi lại điều gì để nuôi dưỡng lòng biết ơn?
              </p>
            </header>

            {/* Quote Section */}
            <section className='relative overflow-hidden rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm'>
              <img
                alt=''
                aria-hidden='true'
                className='pointer-events-none absolute -top-4 -right-6 h-28 w-28 opacity-30 mix-blend-multiply blur-[1px]'
                src='/icons/icon_leaf_2.png'
              />
              <div className='relative z-10 flex items-start gap-4'>
                <div className='bg-primary/60 mt-1 h-12 w-1 rounded-full' />
                <div>
                  <div className='text-muted-foreground mb-3 flex items-center gap-2 text-xs font-semibold'>
                    <SparklesIcon className='text-accent h-4 w-4' />
                    Pháp ngữ mỗi ngày
                  </div>
                  <p className='text-foreground/80 text-lg leading-relaxed italic'>
                    “Mỗi việc thiện nhỏ đều gieo một hạt giống.”
                  </p>
                  <div className='text-muted-foreground/60 mt-4 flex items-center gap-2 text-[10px] font-semibold tracking-[0.3em] uppercase'>
                    Lời nhắc từ thiện tâm
                  </div>
                </div>
              </div>
            </section>

            {/* Quick check-in */}
            <section className='relative overflow-hidden rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm'>
              <img
                alt=''
                aria-hidden='true'
                className='pointer-events-none absolute -bottom-6 -left-8 h-32 w-32 opacity-25 mix-blend-multiply blur-[1px]'
                src='/icons/icon_leaf_3.png'
              />
              <div className='relative z-10 flex flex-col gap-4'>
                <div>
                  <h2 className='text-foreground text-lg font-semibold'>Việc thiện hôm nay</h2>
                  <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
                    Bạn đã thực hành điều gì hôm nay?
                  </p>
                </div>
                <div className='relative grid gap-3 sm:grid-cols-3'>
                  <button
                    className='group bg-body/30 text-foreground hover:bg-body/40 flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-black/5 px-3 py-4 text-sm font-medium transition-colors'
                    type='button'>
                    <img alt='Thân' className='h-10 w-10' src='/icons/icon_than.png' />
                    Thân
                  </button>
                  <button
                    className='group bg-speech/30 text-foreground hover:bg-speech/40 flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-black/5 px-3 py-4 text-sm font-medium transition-colors'
                    type='button'>
                    <img alt='Khẩu' className='h-10 w-10' src='/icons/icon_khau.png' />
                    Khẩu
                  </button>
                  <button
                    className='group bg-mind/30 text-foreground hover:bg-mind/40 flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-black/5 px-3 py-4 text-sm font-medium transition-colors'
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
            </section>

            {/* Progress */}
            <section className='relative overflow-hidden rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm'>
              <img
                alt=''
                aria-hidden='true'
                className='pointer-events-none absolute -right-8 -bottom-6 h-32 w-32 opacity-25 mix-blend-multiply blur-[1px]'
                src='/icons/icon_leaf_1.png'
              />
              <div className='relative z-10 mb-4 flex items-center justify-between'>
                <div>
                  <h2 className='text-foreground text-lg font-semibold'>Chuỗi thiện lành</h2>
                  <p className='text-muted-foreground mt-1 text-sm'>5 ngày liên tiếp</p>
                </div>
                <span className='text-muted-foreground text-xs'>Mục tiêu tuần</span>
              </div>
              <div className='bg-muted relative z-10 h-2 w-full rounded-full'>
                <div className='bg-primary/70 h-2 w-[70%] rounded-full' />
              </div>
              <div className='text-muted-foreground relative z-10 mt-3 text-xs'>
                Còn 2 ngày nữa để hoàn tất mục tiêu tuần này.
              </div>
            </section>

            {/* Today Section */}
            <section className='relative overflow-hidden rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm'>
              <img
                alt=''
                aria-hidden='true'
                className='pointer-events-none absolute -top-8 -left-8 h-28 w-28 opacity-25 mix-blend-multiply blur-[1px]'
                src='/icons/icon_leaf_4.png'
              />
              <div className='relative z-10 mb-4 flex items-end justify-between'>
                <h2 className='text-foreground text-lg font-semibold'>Hôm nay</h2>
                <Button
                  className='text-muted-foreground hover:text-primary h-auto p-0 text-xs font-medium hover:bg-transparent'
                  variant='ghost'>
                  Xem tất cả
                </Button>
              </div>

              <div className='relative z-10 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-black/10 bg-white/60 px-4 py-10 text-center'>
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
