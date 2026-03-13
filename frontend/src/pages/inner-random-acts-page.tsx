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
import { INFO_COPY } from '@/lib/constants/info-copy'
import { t } from '@/lib/i18n'

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
          description={t('pages.randomActs.header.description')}
          note={t('pages.randomActs.header.note')}
          subtitle={t('pages.randomActs.header.subtitle')}
          title={t('pages.randomActs.header.title')}
        />

        <CardSection className='gap-4'>
          {isFetching && !act ? (
            <div className='bg-card/80 flex min-h-50 items-center justify-center rounded-2xl border border-black/5 p-5'>
              <Spinner />
            </div>
          ) : act ? (
            <>
              <div className='border-primary/20 bg-card/80 rounded-2xl border-2 p-5'>
                <div className='flex flex-wrap items-center gap-2'>
                  <span className='text-muted-foreground text-xs'>
                    {t('pages.randomActs.randomLabel')}
                  </span>
                </div>
                <h3 className='text-foreground mt-3 text-lg font-semibold'>{act.name}</h3>
                {act.detail ? (
                  <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>{act.detail}</p>
                ) : null}
                {act.note ? (
                  <div className='text-muted-foreground mt-4 flex items-center gap-2 text-xs'>
                    <HelpCircleIcon className='h-3.5 w-3.5' />
                    {act.note}
                  </div>
                ) : (
                  <div className='text-muted-foreground mt-4 flex items-center gap-2 text-xs'>
                    <HelpCircleIcon className='h-3.5 w-3.5' />
                    {t('pages.randomActs.fallbackNote')}
                  </div>
                )}
              </div>
              <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                <Button
                  className='text-foreground group bg-card hover:bg-card/80 h-11 w-full rounded-full border border-black/5 sm:w-auto'
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
                  {t('pages.randomActs.actions.refresh')}
                </Button>
              </div>
            </>
          ) : (
            <div className='bg-card/80 rounded-2xl border border-black/5 p-5'>
              <p className='text-muted-foreground text-center text-sm'>
                {t('pages.randomActs.empty')}
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
