import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import { DailyQuoteCard, HeaderSection, InfoButton, MiniCheckInCard } from '@/components/shared'
import { CalendarStats } from '@/components/stats/calendar-stats'
import { StatsCard } from '@/components/stats/stats-card'
import { INFO_COPY } from '@/lib/info-copy'

const StatsPage = () => {
  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          action={
            <InfoButton description={INFO_COPY.stats.description} title={INFO_COPY.stats.title} />
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
