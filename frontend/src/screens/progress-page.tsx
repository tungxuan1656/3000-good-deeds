'use client'

import { GoalHistoryCard, GoalSettingCard } from '@/components/goals'
import {
  MainColumn,
  MainContainer,
  SideColumn,
} from '@/components/layout/main-container'
import { DailyQuoteCard } from '@/components/shared/daily-quote-card'
import { KindnessSuggestionCard } from '@/components/shared/kindness-suggestion-card'
import { MiniCheckInCard } from '@/components/shared/mini-check-in-card'
import { PageHeader } from '@/components/shared/page-header'
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
