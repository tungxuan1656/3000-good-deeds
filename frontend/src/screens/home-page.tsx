'use client'

import dynamic from 'next/dynamic'

import { RecordDeedCard } from '@/components/home/record-deed-card'
import { TodaySection } from '@/components/home/today-section'
import {
  MainColumn,
  MainContainer,
  SideColumn,
} from '@/components/layout/main-container'
import { InfoButton } from '@/components/shared/info-button'
import { PageHeader } from '@/components/shared/page-header'
import { INFO_COPY } from '@/lib/constants/info-copy'
import { t } from '@/lib/i18n'

const DailyQuoteCard = dynamic(
  () =>
    import('@/components/shared/daily-quote-card').then(
      (module) => module.DailyQuoteCard,
    ),
  { ssr: false },
)

const KindnessSuggestionCard = dynamic(
  () =>
    import('@/components/shared/kindness-suggestion-card').then(
      (module) => module.KindnessSuggestionCard,
    ),
  { ssr: false },
)

const JourneyStatsCard = dynamic(
  () =>
    import('@/components/home/journey-stats-card').then(
      (module) => module.JourneyStatsCard,
    ),
  { ssr: false },
)

const HomePage = () => {
  return (
    <MainContainer>
      <MainColumn className='flex flex-col gap-4 md:gap-6'>
        <PageHeader
          action={
            <InfoButton
              description={INFO_COPY.home.description}
              title={INFO_COPY.home.title}
            />
          }
          description={t('home.header.description')}
          title={t('home.header.title')}
        />

        {/* Record Section */}
        <RecordDeedCard />

        {/* Today's Summary Section */}
        <TodaySection />
      </MainColumn>

      {/* Side column */}
      <SideColumn className='flex flex-col gap-4 md:gap-6'>
        <DailyQuoteCard />

        <KindnessSuggestionCard />

        <JourneyStatsCard />
      </SideColumn>
    </MainContainer>
  )
}

export default HomePage
