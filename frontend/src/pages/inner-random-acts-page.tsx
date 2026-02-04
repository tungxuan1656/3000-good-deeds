import { HelpCircleIcon, RefreshCwIcon, ThumbsUpIcon } from 'lucide-react'
import { useState } from 'react'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  CardSection,
  DailyQuoteCard,
  HeaderSection,
  MiniCheckInCard,
  WeeklyRhythmCard,
} from '@/components/shared'
import { Button } from '@/components/ui/button'

const InnerRandomActsPage = () => {
  const [saved, setSaved] = useState(false)

  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          description='Chọn một việc thiện phù hợp để nuôi dưỡng tâm từ, bi, hỷ, xả trong ngày.'
          subtitle='Gợi ý việc thiện'
          title='Một gợi ý trong ngày'
        />

        <CardSection className='gap-4'>
          <div className='rounded-2xl border border-black/5 bg-white/80 p-5'>
            <p className='text-foreground text-lg font-semibold'>Gửi một lời cảm ơn</p>
            <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
              Hãy cảm ơn một người đã giúp bạn hôm nay, dù chỉ là điều nhỏ.
            </p>
            <div className='text-muted-foreground mt-3 text-xs'>Gợi ý thuộc Khẩu thiện</div>
            <div className='text-muted-foreground mt-2 flex items-center gap-2 text-xs'>
              <HelpCircleIcon className='h-3.5 w-3.5' />
              Vì sao gợi ý này? Dựa trên nhịp tuần của bạn.
            </div>
          </div>
          <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
            <Button
              className='h-11 w-full rounded-full sm:w-auto'
              disabled={saved}
              onClick={() => setSaved(true)}>
              <ThumbsUpIcon className='h-4 w-4' />
              {saved ? 'Đã thực hiện' : 'Lưu lại'}
            </Button>
            <Button
              className='text-foreground group h-11 w-full rounded-full border border-black/5 bg-white hover:bg-white/80 sm:w-auto'
              variant='secondary'>
              <RefreshCwIcon className='h-4 w-4 transition-transform duration-300 group-hover:rotate-180' />
              Gợi ý khác
            </Button>
          </div>
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
