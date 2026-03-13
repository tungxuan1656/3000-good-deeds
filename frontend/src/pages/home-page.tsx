import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

import { TodaySection } from '@/components/home/today-section'
import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  CheckInCard,
  DailyQuoteCard,
  HeaderSection,
  ReminderSuggestCard,
  WeeklyRhythmCard,
} from '@/components/shared'
import { InfoButton, TourGuideButton } from '@/components/shared'
import { ONBOARDING_CONTENT, ONBOARDING_KEYS } from '@/lib/constants'
import { t } from '@/lib/i18n'
import { INFO_COPY } from '@/lib/info-copy'

const HomePage = () => {
  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          action={
            <div className='flex items-center gap-1'>
              <InfoButton description={INFO_COPY.home.description} title={INFO_COPY.home.title} />
              <TourGuideButton
                flowTitle={ONBOARDING_CONTENT.general.title}
                steps={ONBOARDING_CONTENT.general.steps}
                storageKey={ONBOARDING_KEYS.general}
              />
            </div>
          }
          description={t('home.header.description')}
          note={t('home.header.note')}
          subtitle={format(new Date(), t('dates.formats.homeHeaderSubtitle'), { locale: vi })}
          title={t('home.header.title')}
        />

        {/* Quote Section */}
        <DailyQuoteCard />
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
