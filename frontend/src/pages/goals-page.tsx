import { GoalHistoryCard, GoalSettingCard } from '@/components/goals'
import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  CardSection,
  DailyQuoteCard,
  HeaderSection,
  InfoButton,
  MiniCheckInCard,
} from '@/components/shared'
import { INFO_COPY } from '@/lib/constants/info-copy'
import { t } from '@/lib/i18n'

const GoalsPage = () => {
  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          action={
            <InfoButton description={INFO_COPY.goals.description} title={INFO_COPY.goals.title} />
          }
          description={t('pages.goals.header.description')}
          note={t('pages.goals.header.note')}
          subtitle={t('pages.goals.header.subtitle')}
          title={t('pages.goals.header.title')}
        />

        <CardSection className='gap-4'>
          <GoalSettingCard />
        </CardSection>

        <CardSection className='gap-4'>
          <GoalHistoryCard />
        </CardSection>
      </MainColumn>

      <SideColumn>
        <MiniCheckInCard />
        <DailyQuoteCard />
      </SideColumn>
    </MainContainer>
  )
}

export default GoalsPage
