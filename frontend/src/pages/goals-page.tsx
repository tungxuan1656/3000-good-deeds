import GoalHistoryCard from '@/components/goals/goal-history-card'
import GoalSettingCard from '@/components/goals/goal-setting-card'
import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  CardSection,
  DailyQuoteCard,
  HeaderSection,
  InfoButton,
  MiniCheckInCard,
} from '@/components/shared'
import { INFO_COPY } from '@/lib/info-copy'

const GoalsPage = () => {
  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          action={
            <InfoButton description={INFO_COPY.goals.description} title={INFO_COPY.goals.title} />
          }
          description='Đặt mục tiêu vừa sức và điều kiện của bạn nhé!.'
          note='Bạn có thể điều chỉnh mục tiêu bất cứ lúc nào.'
          subtitle='Mục tiêu'
          title='Giữ nhịp đều đặn'
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
