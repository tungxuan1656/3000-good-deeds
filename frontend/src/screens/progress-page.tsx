'use client'

import { GoalHistoryCard, GoalSettingCard } from '@/components/goals'
import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  DailyQuoteCard,
  KindnessSuggestionCard,
  MiniCheckInCard,
  PageHeader,
} from '@/components/shared'
import { CalendarStats, StatsCard } from '@/components/stats'
import { t } from '@/lib/i18n'

const ProgressPage = () => {
  return (
    <MainContainer>
      <MainColumn>
        <PageHeader
          description={t('pages.progress.header.description')}
          title={t('pages.progress.header.title')}
        />

        <StatsCard />
        <GoalSettingCard />
        <CalendarStats />
        <GoalHistoryCard />
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
