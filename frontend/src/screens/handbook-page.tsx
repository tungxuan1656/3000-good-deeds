'use client'

import { ReflectionHistory } from '@/components/inner/reflection-history'
import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  DailyQuoteCard,
  HandbookReflectionFormCard,
  InfoButton,
  KindnessSuggestionCard,
  MiniCheckInCard,
  PageHeader,
  WeeklyRhythmCard,
} from '@/components/shared'
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
