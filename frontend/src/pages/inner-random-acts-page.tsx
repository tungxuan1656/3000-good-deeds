import { HelpCircleIcon, RefreshCwIcon } from 'lucide-react'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  CardSection,
  DailyQuoteCard,
  HeaderSection,
  MiniCheckInCard,
  WeeklyRhythmCard,
} from '@/components/shared'
import { InfoButton, TourGuideButton } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useRandomActs } from '@/hooks/api/use-cultivation'
import { ONBOARDING_CONTENT, ONBOARDING_KEYS } from '@/lib/constants'
import { INFO_COPY } from '@/lib/info-copy'

const InnerRandomActsPage = () => {
  const { data, isFetching, refetch } = useRandomActs(1, true)
  const act = data?.data?.[0]

  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          action={
            <div className='flex items-center gap-1'>
              <InfoButton
                description={INFO_COPY.randomActs.description}
                title={INFO_COPY.randomActs.title}
              />
              <TourGuideButton
                autoOpen
                flowTitle={ONBOARDING_CONTENT.quoteRandomActs.title}
                steps={ONBOARDING_CONTENT.quoteRandomActs.steps}
                storageKey={ONBOARDING_KEYS.quoteRandomActs}
              />
            </div>
          }
          description='Chọn một việc thiện nhỏ phù hợp với mình lúc này.'
          note='Bạn có thể bỏ qua hoặc đổi gợi ý bất cứ lúc nào.'
          subtitle='Gợi ý việc thiện'
          title='Một gợi ý trong ngày'
        />

        <CardSection className='gap-4'>
          {isFetching && !act ? (
            <div className='flex min-h-50 items-center justify-center rounded-2xl border border-black/5 bg-white/80 p-5'>
              <Spinner />
            </div>
          ) : act ? (
            <>
              <div className='border-primary/20 rounded-2xl border-2 bg-white/80 p-5'>
                <p className='text-foreground text-lg leading-relaxed font-semibold'>
                  {act.content}
                </p>
                <div className='text-muted-foreground mt-4 flex items-center gap-2 text-sm'>
                  <HelpCircleIcon className='h-3.5 w-3.5' />
                  Gợi ý ngẫu nhiên để bạn tham khảo
                </div>
              </div>
              <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                <Button
                  className='text-foreground group h-11 w-full rounded-full border border-black/5 bg-white hover:bg-white/80 sm:w-auto'
                  disabled={isFetching}
                  variant='secondary'
                  onClick={() => {
                    refetch()
                  }}>
                  {isFetching ? (
                    <Spinner />
                  ) : (
                    <RefreshCwIcon className='h-4 w-4 transition-transform duration-300 group-hover:rotate-180' />
                  )}
                  Gợi ý khác
                </Button>
              </div>
            </>
          ) : (
            <div className='rounded-2xl border border-black/5 bg-white/80 p-5'>
              <p className='text-muted-foreground text-center text-sm'>
                Chưa có gợi ý lúc này. Bạn có thể thử lại sau.
              </p>
            </div>
          )}
        </CardSection>
      </MainColumn>

      <SideColumn>
        <MiniCheckInCard />
        <DailyQuoteCard />
        <WeeklyRhythmCard />
      </SideColumn>
    </MainContainer>
  )
}

export default InnerRandomActsPage
