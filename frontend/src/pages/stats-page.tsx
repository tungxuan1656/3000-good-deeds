import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  DailyQuoteCard,
  HeaderSection,
  InfoButton,
  MiniCheckInCard,
  TourGuideButton,
} from '@/components/shared'
import { CalendarStats } from '@/components/stats/calendar-stats'
import { StatsCard } from '@/components/stats/stats-card'
import { ONBOARDING_CONTENT } from '@/lib/constants'
import { INFO_COPY } from '@/lib/info-copy'

const StatsPage = () => {
  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          action={
            <div className='flex items-center gap-1'>
              <InfoButton description={INFO_COPY.stats.description} title={INFO_COPY.stats.title} />
              <TourGuideButton
                flowTitle={ONBOARDING_CONTENT.stats.title}
                steps={ONBOARDING_CONTENT.stats.steps}
              />
            </div>
          }
          description='Nhìn lại để hiểu tâm của mình, không phải để so sánh.'
          note='Các con số chỉ là tấm gương để soi chiếu.'
          subtitle='Thống kê'
          title='Nhìn lại hành trình'
        />

        <StatsCard />
        <CalendarStats />
      </MainColumn>

      <SideColumn>
        <MiniCheckInCard />
        <DailyQuoteCard />
      </SideColumn>
    </MainContainer>
  )
}

export default StatsPage
