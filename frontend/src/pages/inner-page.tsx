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
import { PATHS } from '@/lib/constants'
import { INFO_COPY } from '@/lib/info-copy'

const InnerPage = () => {
  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          action={
            <InfoButton
              description={INFO_COPY.cultivation.description}
              title={INFO_COPY.cultivation.title}
            />
          }
          description='Sổ tay quán chiếu — một bước nhỏ để quay về với mình.'
          note='Viết xuống để nhìn rõ và buông nhẹ.'
          subtitle='Tu tập'
          title='Không gian tu tập'
        />

        <CardSection className='gap-4'>
          <p className='text-foreground text-base font-semibold'>Sổ tay quán chiếu</p>
          <div className='flex flex-col gap-3'>
            <Link
              className='flex items-center gap-4 rounded-2xl border border-black/5 bg-white/80 px-4 py-4 transition-colors hover:bg-white'
              to={PATHS.INNER_JOURNAL}>
              <div className='bg-mind/20 flex h-12 w-12 items-center justify-center rounded-2xl'>
                <BookOpenIcon className='text-primary h-5 w-5' />
              </div>
              <div className='flex-1'>
                <p className='text-foreground text-base font-semibold'>Sổ tay quán chiếu</p>
                <p className='text-muted-foreground mt-1 text-sm'>
                  Viết xuống để nhìn rõ và buông nhẹ.
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
