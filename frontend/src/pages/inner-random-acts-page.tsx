import { HelpCircleIcon, RefreshCwIcon, ThumbsUpIcon } from 'lucide-react'
import { useState } from 'react'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import { CardSection } from '@/components/shared/card-section'
import { DailyQuoteCard } from '@/components/shared/daily-quote-card'
import { MiniCheckInCard } from '@/components/shared/mini-check-in-card'
import { WeeklyRhythmCard } from '@/components/shared/weekly-rhythm-card'
import { Button } from '@/components/ui/button'

const InnerRandomActsPage = () => {
  const [saved, setSaved] = useState(false)

  return (
    <MainContainer>
      <MainColumn>
        <CardSection as='header'>
          <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
            Gieo duyên
          </p>
          <h1 className='text-foreground mt-2 text-2xl font-semibold tracking-tight'>
            Một gợi ý nhỏ
          </h1>
          <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
            Chọn một việc thiện nhẹ nhàng để bắt đầu hôm nay.
          </p>
        </CardSection>

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
              {saved ? 'Đã gieo' : 'Lưu lại'}
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
        <DailyQuoteCard quote='“Mỗi việc thiện nhỏ đều gieo một hạt giống.”' />
        <WeeklyRhythmCard
          activeCount={4}
          description='4/7 ngày đã gieo hạt. Hãy giữ nhịp nhẹ nhàng.'
        />
      </SideColumn>
    </MainContainer>
  )
}

export default InnerRandomActsPage
