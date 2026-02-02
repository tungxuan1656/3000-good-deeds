import { CheckCircle2Icon, FlagIcon, PlusIcon } from 'lucide-react'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import { CardSection } from '@/components/shared/card-section'
import { DailyQuoteCard } from '@/components/shared/daily-quote-card'
import { MiniCheckInCard } from '@/components/shared/mini-check-in-card'
import { WeeklyRhythmCard } from '@/components/shared/weekly-rhythm-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const GoalsPage = () => {
  const hasActiveGoal = true
  const isLoading = false
  const historyGoals = [
    {
      id: 'g1',
      title: 'Mục tiêu tuần',
      description: '7 việc thiện trong 7 ngày',
      result: 'Đã hoàn thành',
      date: 'Tuần 1 · 10/2026',
    },
    {
      id: 'g2',
      title: 'Mục tiêu tháng',
      description: '20 việc thiện trong tháng',
      result: 'Hoàn thành 16/20',
      date: '09/2026',
    },
  ]

  return (
    <MainContainer>
      <MainColumn>
        <CardSection as='header'>
          <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
            Mục tiêu
          </p>
          <h1 className='text-foreground mt-2 text-2xl font-semibold tracking-tight'>
            Giữ nhịp đều đặn
          </h1>
          <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
            Cài đặt mục tiêu vừa đủ để nuôi dưỡng thói quen tốt.
          </p>
        </CardSection>

        {isLoading && (
          <div className='flex flex-col gap-4'>
            {[1, 2].map((item) => (
              <div
                key={item}
                className='rounded-2xl border border-black/5 bg-white/80 p-4 shadow-sm'>
                <div className='bg-muted mb-3 h-4 w-32 animate-pulse rounded-full' />
                <div className='bg-muted h-20 w-full animate-pulse rounded-2xl' />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !hasActiveGoal && (
          <CardSection className='flex flex-col items-center gap-3 text-center'>
            <p className='text-muted-foreground text-sm'>Bạn chưa thiết lập mục tiêu nào.</p>
            <Button className='h-10 rounded-full px-5 text-sm'>Tạo mục tiêu đầu tiên</Button>
          </CardSection>
        )}

        {!isLoading && hasActiveGoal && (
          <CardSection className='gap-4'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
                  Mục tiêu đang chạy
                </p>
                <h2 className='text-foreground mt-2 text-lg font-semibold'>7 việc thiện / tuần</h2>
                <p className='text-muted-foreground mt-2 text-sm'>Chỉ còn 2 ngày nữa thôi 🌿</p>
              </div>
              <div className='bg-secondary/40 flex h-10 w-10 items-center justify-center rounded-full'>
                <FlagIcon className='text-primary h-5 w-5' />
              </div>
            </div>

            <div className='bg-muted h-2.5 w-full rounded-full'>
              <div className='bg-primary/70 h-2.5 w-[70%] rounded-full' />
            </div>
            <div className='text-muted-foreground text-xs'>Đã hoàn thành 5/7 việc thiện.</div>
          </CardSection>
        )}

        {!isLoading && (
          <CardSection className='gap-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-foreground text-base font-semibold'>Thiết lập mục tiêu mới</p>
                <p className='text-muted-foreground mt-1 text-xs'>Chọn nhịp phù hợp với bạn.</p>
              </div>
              <div className='bg-secondary/40 flex h-9 w-9 items-center justify-center rounded-full'>
                <PlusIcon className='text-primary h-4 w-4' />
              </div>
            </div>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='flex flex-col gap-2'>
                <Label className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
                  Kiểu mục tiêu
                </Label>
                <div className='flex gap-2'>
                  <button className='text-foreground rounded-full border border-black/5 bg-white px-4 py-2 text-sm font-medium'>
                    Hằng ngày
                  </button>
                  <button className='text-muted-foreground rounded-full border border-black/5 bg-white/60 px-4 py-2 text-sm font-medium'>
                    Hằng tuần
                  </button>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <Label className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
                  Số lượng việc thiện
                </Label>
                <Input
                  className='rounded-2xl border border-black/5 bg-white px-4 py-2 text-sm'
                  defaultValue='1'
                  type='number'
                />
              </div>
            </div>
            <Button className='h-11 w-full rounded-full'>Lưu mục tiêu</Button>
          </CardSection>
        )}

        {!isLoading && historyGoals.length > 0 && (
          <CardSection className='gap-4'>
            <p className='text-foreground text-base font-semibold'>Lịch sử mục tiêu</p>
            <div className='flex flex-col gap-3'>
              {historyGoals.map((goal) => (
                <div
                  key={goal.id}
                  className='flex flex-col gap-2 rounded-2xl border border-black/5 bg-white/80 p-4'>
                  <div className='flex items-center justify-between'>
                    <p className='text-foreground text-sm font-semibold'>{goal.title}</p>
                    <span className='text-muted-foreground text-xs'>{goal.date}</span>
                  </div>
                  <p className='text-muted-foreground text-xs'>{goal.description}</p>
                  <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                    <CheckCircle2Icon className='text-primary h-3.5 w-3.5' />
                    {goal.result}
                  </div>
                </div>
              ))}
            </div>
          </CardSection>
        )}
      </MainColumn>

      <SideColumn>
        <MiniCheckInCard />
        <DailyQuoteCard quote='“Mỗi việc thiện nhỏ đều gieo một hạt giống.”' />
        <WeeklyRhythmCard
          activeCount={4}
          description='4/7 ngày đã gieo hạt. Hãy giữ nhịp nhẹ nhàng.'
        />
      </SideColumn>
    </MainContainer>
  )
}

export default GoalsPage
