import GoalHistoryCard from '@/components/goals/goal-history-card'
import GoalSettingCard from '@/components/goals/goal-setting-card'
import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import { CardSection, DailyQuoteCard, HeaderSection, MiniCheckInCard } from '@/components/shared'

const GoalsPage = () => {
  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          description='Đặt mục tiêu vừa sức để nuôi dưỡng thói quen thiện.'
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
