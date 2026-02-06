import { BookOpenIcon, HeartHandshakeIcon, LeafIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import { CardSection, HeaderSection, MiniCheckInCard, WeeklyRhythmCard } from '@/components/shared'
import { PATHS } from '@/lib/constants'

const InnerPage = () => {
  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          description='Pháp ngữ, sổ tay, thiền thở — những bước nhỏ nuôi dưỡng tâm từ bi và chánh niệm.'
          subtitle='Nội tâm'
          title='Không gian tu tập'
        />

        <CardSection className='gap-4'>
          <p className='text-foreground text-base font-semibold'>Chọn một không gian</p>
          <div className='flex flex-col gap-3'>
            <Link
              className='flex items-center gap-4 rounded-2xl border border-black/5 bg-white/80 px-4 py-4 transition-colors hover:bg-white'
              to={PATHS.INNER_RANDOM_ACTS}>
              <div className='bg-secondary/40 flex h-12 w-12 items-center justify-center rounded-2xl'>
                <HeartHandshakeIcon className='text-primary h-5 w-5' />
              </div>
              <div className='flex-1'>
                <p className='text-foreground text-base font-semibold'>Gợi ý việc thiện</p>
                <p className='text-muted-foreground mt-1 text-sm'>Khởi tâm từ bi trong đời sống.</p>
              </div>
            </Link>

            <Link
              className='flex items-center gap-4 rounded-2xl border border-black/5 bg-white/80 px-4 py-4 transition-colors hover:bg-white'
              to={PATHS.INNER_JOURNAL}>
              <div className='bg-mind/20 flex h-12 w-12 items-center justify-center rounded-2xl'>
                <BookOpenIcon className='text-primary h-5 w-5' />
              </div>
              <div className='flex-1'>
                <p className='text-foreground text-base font-semibold'>Sổ tay tâm hồn</p>
                <p className='text-muted-foreground mt-1 text-sm'>Viết lại điều bạn muốn giữ.</p>
              </div>
            </Link>

            <Link
              className='flex items-center gap-4 rounded-2xl border border-black/5 bg-white/80 px-4 py-4 transition-colors hover:bg-white'
              to={PATHS.INNER_MEDITATION}>
              <div className='bg-body/20 flex h-12 w-12 items-center justify-center rounded-2xl'>
                <LeafIcon className='text-primary h-5 w-5' />
              </div>
              <div className='flex-1'>
                <p className='text-foreground text-base font-semibold'>Thiền & thở</p>
                <p className='text-muted-foreground mt-1 text-sm'>Thở sâu, trở về hiện tại.</p>
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
