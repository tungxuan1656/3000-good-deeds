import { GoalHistoryCard, GoalSettingCard } from '@/components/goals'
import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  CardSection,
  DailyQuoteCard,
  HeaderSection,
  KindnessSuggestionCard,
  MiniCheckInCard,
} from '@/components/shared'
import { CalendarStats, StatsCard } from '@/components/stats'
import { t } from '@/lib/i18n'

const ProgressPage = () => {
  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          description={t('pages.progress.header.description')}
          note={t('pages.progress.header.note')}
          subtitle={t('pages.progress.header.subtitle')}
          title={t('pages.progress.header.title')}
        />

        <StatsCard />

        <CardSection className='gap-4'>
          <GoalSettingCard />
        </CardSection>

        <CalendarStats />

        <CardSection className='gap-4'>
          <GoalHistoryCard />
        </CardSection>
      </MainColumn>

      <SideColumn hideInMobile>
        <MiniCheckInCard />
        <DailyQuoteCard />
        <KindnessSuggestionCard />
      </SideColumn>
    </MainContainer>
  )
}

export default ProgressPage
