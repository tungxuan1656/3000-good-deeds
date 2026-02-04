import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

import { TodaySection } from '@/components/home/today-section'
import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  CheckInCard,
  DailyQuoteCard,
  HeaderSection,
  ReminderSuggestCard,
  WeeklyRhythmCard,
} from '@/components/shared'

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
