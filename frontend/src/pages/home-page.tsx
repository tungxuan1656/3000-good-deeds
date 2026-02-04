import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

import { TodaySection } from '@/components/home/today-section'
import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import { CheckInCard } from '@/components/shared'
import { CardSection } from '@/components/shared/card-section'
import { DailyQuoteCard } from '@/components/shared/daily-quote-card'
import { HeaderSection } from '@/components/shared/header-section'
import Leaf from '@/components/shared/leaf'
import { ReminderSuggestCard } from '@/components/shared/reminder-suggest-card'
import { WeeklyRhythmCard } from '@/components/shared/weekly-rhythm-card'

const HomePage = () => {
  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          description='Hôm nay bạn muốn ghi lại điều gì để nuôi dưỡng lòng biết ơn?'
          subtitle={format(new Date(), "EEEE', ngày' dd'/'MM", { locale: vi })}
          title='Hôm nay của bạn'
        />

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
        <WeeklyRhythmCard />

        <ReminderSuggestCard />
      </SideColumn>
    </MainContainer>
  )
}

export default HomePage
