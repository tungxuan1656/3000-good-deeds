'use client'

import { ReflectionHistory } from '@/components/inner/reflection-history'
import {
  MainColumn,
  MainContainer,
  SideColumn,
} from '@/components/layout/main-container'
import { DailyQuoteCard } from '@/components/shared/daily-quote-card'
import { HandbookReflectionFormCard } from '@/components/shared/handbook-reflection-form-card'
import { InfoButton } from '@/components/shared/info-button'
import { KindnessSuggestionCard } from '@/components/shared/kindness-suggestion-card'
import { MiniCheckInCard } from '@/components/shared/mini-check-in-card'
import { PageHeader } from '@/components/shared/page-header'
import { WeeklyRhythmCard } from '@/components/shared/weekly-rhythm-card'
import { INFO_COPY } from '@/lib/constants/info-copy'
import { t } from '@/lib/i18n'

const HandbookPage = () => {
  return (
    <MainContainer>
      <MainColumn>
        <PageHeader
          action={
            <InfoButton
              description={INFO_COPY.journal.description}
              title={INFO_COPY.journal.title}
            />
          }
          description={t('pages.handbook.header.description')}
          title={t('pages.handbook.header.title')}
        />

        <HandbookReflectionFormCard />

        <ReflectionHistory />
      </MainColumn>

      <SideColumn hideInMobile>
        <DailyQuoteCard />
        <KindnessSuggestionCard />
        <MiniCheckInCard />
        <WeeklyRhythmCard />
      </SideColumn>
    </MainContainer>
  )
}

export default HandbookPage
