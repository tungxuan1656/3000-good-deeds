import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  DailyQuoteCard,
  HeaderSection,
  InfoButton,
  MiniCheckInCard,
  TourGuideButton,
} from '@/components/shared'
import { CalendarStats, StatsCard } from '@/components/stats'
import { ONBOARDING_CONTENT, ONBOARDING_KEYS } from '@/lib/constants'
import { INFO_COPY } from '@/lib/constants/info-copy'
import { t } from '@/lib/i18n'

const StatsPage = () => {
  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          action={
            <div className='flex items-center gap-1'>
              <InfoButton description={INFO_COPY.stats.description} title={INFO_COPY.stats.title} />
              <TourGuideButton
                autoOpen
                flowTitle={ONBOARDING_CONTENT.stats.title}
                steps={ONBOARDING_CONTENT.stats.steps}
                storageKey={ONBOARDING_KEYS.stats}
              />
            </div>
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
