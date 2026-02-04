import { TodaySection } from '@/components/home/today-section'
import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import { CheckInCard } from '@/components/shared'
import { CardSection } from '@/components/shared/card-section'
import { DailyQuoteCard } from '@/components/shared/daily-quote-card'
import Leaf from '@/components/shared/leaf'
import { ReminderSuggestCard } from '@/components/shared/reminder-suggest-card'
import { WeeklyRhythmCard } from '@/components/shared/weekly-rhythm-card'

const HomePage = () => {
  return (
    <MainContainer>
      <MainColumn>
        {/* Header */}
        <CardSection as='header'>
          <Leaf position='top-left' variant={1} />
          <p className='text-muted-foreground/70 text-[11px] font-semibold tracking-wider uppercase sm:text-xs'>
            Chủ nhật, 15/10
          </p>
          <h1 className='text-foreground mt-2 text-2xl font-semibold tracking-tight sm:text-3xl'>
            Hôm nay của bạn
          </h1>
          <p className='text-muted-foreground/90 mt-3 max-w-xl text-sm leading-relaxed sm:text-base'>
            Hôm nay bạn muốn ghi lại điều gì để nuôi dưỡng lòng biết ơn?
          </p>
        </CardSection>

        {/* Quote Section */}
        <DailyQuoteCard />
        <CheckInCard />

        {/* Progress */}
        <CardSection>
          <Leaf className='h-32 w-32' position='bottom-right' variant={1} />
          <div className='mb-4 flex items-center justify-between gap-3'>
            <div>
              <h2 className='text-foreground text-lg font-semibold'>Chuỗi thiện lành</h2>
              <p className='text-muted-foreground mt-1 text-xs sm:text-sm'>5 ngày liên tiếp</p>
            </div>
            <span className='text-muted-foreground text-xs'>Mục tiêu tuần</span>
          </div>
          <div className='bg-muted h-2.5 w-full rounded-full'>
            <div className='bg-primary/70 h-2.5 w-[70%] rounded-full' />
          </div>
          <div className='text-muted-foreground/90 mt-3 text-xs sm:text-sm'>
            Còn 2 ngày nữa để hoàn tất mục tiêu tuần này.
          </div>
        </CardSection>

        <TodaySection />
      </MainColumn>

      {/* Side column */}
      <SideColumn>
        <WeeklyRhythmCard
          activeCount={4}
          description='4/7 ngày đã gieo hạt. Hãy giữ nhịp nhẹ nhàng.'
        />

        <ReminderSuggestCard />
      </SideColumn>
    </MainContainer>
  )
}

export default HomePage
