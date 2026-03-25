import {
  JourneyStatsCard,
  RecordDeedCard,
  TodaySection,
} from '@/components/home'
import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  DailyQuoteCard,
  InfoButton,
  KindnessSuggestionCard,
  PageHeader,
} from '@/components/shared'
import { INFO_COPY } from '@/lib/constants/info-copy'
import { t } from '@/lib/i18n'

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
