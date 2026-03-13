import { BookOpenIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  CardSection,
  HeaderSection,
  InfoButton,
  MiniCheckInCard,
  WeeklyRhythmCard,
} from '@/components/shared'
import { TourGuideButton } from '@/components/shared'
import { ONBOARDING_CONTENT, PATHS } from '@/lib/constants'
import { t } from '@/lib/i18n'
import { INFO_COPY } from '@/lib/info-copy'

const InnerPage = () => {
  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          action={
            <div className='flex items-center gap-1'>
              <InfoButton
                description={INFO_COPY.cultivation.description}
                title={INFO_COPY.cultivation.title}
              />
              <TourGuideButton
                flowTitle={ONBOARDING_CONTENT.journal.title}
                steps={ONBOARDING_CONTENT.journal.steps}
              />
            </div>
          }
          description={t('pages.inner.header.description')}
          note={t('pages.inner.header.note')}
          subtitle={t('pages.inner.header.subtitle')}
          title={t('pages.inner.header.title')}
        />

        <CardSection className='gap-4'>
          <p className='text-foreground text-base font-semibold'>
            {t('pages.inner.journalCard.title')}
          </p>
          <div className='flex flex-col gap-3'>
            <Link
              className='flex items-center gap-4 rounded-2xl border border-black/5 bg-white/80 px-4 py-4 transition-colors hover:bg-white'
              to={PATHS.INNER_JOURNAL}>
              <div className='bg-mind/20 flex h-12 w-12 items-center justify-center rounded-2xl'>
                <BookOpenIcon className='text-primary h-5 w-5' />
              </div>
              <div className='flex-1'>
                <p className='text-foreground text-base font-semibold'>
                  {t('pages.inner.journalCard.title')}
                </p>
                <p className='text-muted-foreground mt-1 text-sm'>
                  {t('pages.inner.journalCard.description')}
                </p>
              </div>
            </Link>
          </div>
        </CardSection>
      </MainColumn>

      <SideColumn>
        <MiniCheckInCard />
        <WeeklyRhythmCard />
      </SideColumn>
    </MainContainer>
  )
}

export default InnerPage
