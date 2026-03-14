import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import { DailyQuoteCard, HeaderSection, InfoButton, MiniCheckInCard } from '@/components/shared'
import { CalendarStats, StatsCard } from '@/components/stats'
import { INFO_COPY } from '@/lib/constants/info-copy'
import { t } from '@/lib/i18n'

const StatsPage = () => {
  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          action={
            <InfoButton description={INFO_COPY.stats.description} title={INFO_COPY.stats.title} />
          }
          description={t('pages.stats.header.description')}
          note={t('pages.stats.header.note')}
          subtitle={t('pages.stats.header.subtitle')}
          title={t('pages.stats.header.title')}
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
