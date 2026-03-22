import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

import { TodaySection } from '@/components/home'
import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  CheckInCard,
  DailyQuoteCard,
  HeaderSection,
  InfoButton,
  KindnessSuggestionCard,
  ReminderSuggestCard,
  WeeklyRhythmCard,
} from '@/components/shared'
import { INFO_COPY } from '@/lib/constants/info-copy'
import { t } from '@/lib/i18n'

const HomePage = () => {
  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          action={
            <InfoButton description={INFO_COPY.home.description} title={INFO_COPY.home.title} />
          }
          description={t('home.header.description')}
          note={t('home.header.note')}
          subtitle={format(new Date(), t('dates.formats.homeHeaderSubtitle'), { locale: vi })}
          title={t('home.header.title')}
        />

        {/* Quote Section */}
        <DailyQuoteCard />
        <KindnessSuggestionCard />
        <CheckInCard />

        <TodaySection />
      </MainColumn>

      {/* Side column */}
      <SideColumn>
        <WeeklyRhythmCard />

        <ReminderSuggestCard />
      </SideColumn>
    </MainContainer>
  )
}

export default HomePage
