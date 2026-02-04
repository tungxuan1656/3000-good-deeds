import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import { DailyQuoteCard, HeaderSection, MiniCheckInCard } from '@/components/shared'
import { CalendarStats } from '@/components/stats/calendar-stats'
import { StatsCard } from '@/components/stats/stats-card'

const StatsPage = () => {
  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          description='Quán chiếu để nuôi dưỡng tâm từ bi, hỷ xả và chánh niệm.'
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
