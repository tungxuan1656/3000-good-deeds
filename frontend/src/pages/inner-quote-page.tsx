import { CheckIcon, RefreshCwIcon, Share2Icon, SparklesIcon } from 'lucide-react'
import { useState } from 'react'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import { CardSection } from '@/components/shared/card-section'
import { DailyQuoteCard } from '@/components/shared/daily-quote-card'
import { MiniCheckInCard } from '@/components/shared/mini-check-in-card'
import { WeeklyRhythmCard } from '@/components/shared/weekly-rhythm-card'
import { Button } from '@/components/ui/button'
import { useRandomQuote } from '@/hooks/api/use-cultivation'

const InnerQuotePage = () => {
  const [saved, setSaved] = useState(false)
  const { data, isFetching, refetch } = useRandomQuote()
  const quote = data?.data
  const displayQuote = quote?.content || 'Chưa có pháp ngữ phù hợp.'
  const displaySource = quote?.author || quote?.source

  return (
    <MainContainer>
      <MainColumn>
        <CardSection as='header'>
          <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
            Pháp ngữ
          </p>
          <h1 className='text-foreground mt-2 text-2xl font-semibold tracking-tight'>
            Pháp ngữ hôm nay
          </h1>
          <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
            Một câu nhắc để bạn trở về với sự dịu dàng.
          </p>
        </CardSection>

        <CardSection className='gap-4'>
          <div className='flex items-start justify-between gap-4'>
            <div className='text-muted-foreground flex items-center gap-3 text-xs'>
              <SparklesIcon className='text-primary h-4 w-4' />
              Thứ ba, 15/10/2026
            </div>
            <Button
              className='h-8 w-8 rounded-full'
              size='icon'
              variant='ghost'
              onClick={() => refetch()}>
              <RefreshCwIcon className={isFetching ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
            </Button>
          </div>
          <p className='text-foreground text-2xl leading-relaxed font-medium italic'>
            {displayQuote}
          </p>
          {displaySource && <p className='text-muted-foreground text-sm'>— {displaySource}</p>}
          <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
            <Button className='h-11 w-full rounded-full sm:w-auto' onClick={() => setSaved(true)}>
              {saved ? (
                <>
                  <CheckIcon className='h-4 w-4' />
                  Đã lưu
                </>
              ) : (
                'Lưu vào nhật ký'
              )}
            </Button>
            <Button
              className='text-foreground h-11 w-full rounded-full border border-black/5 bg-white hover:bg-white/80 sm:w-auto'
              variant='secondary'>
              <Share2Icon className='h-4 w-4' />
              Chia sẻ
            </Button>
          </div>
          {saved && (
            <div className='text-muted-foreground rounded-2xl border border-black/5 bg-white/80 px-4 py-3 text-xs'>
              Đã gieo thêm một hạt an lành 🌱
            </div>
          )}
        </CardSection>
      </MainColumn>

      <SideColumn>
        <MiniCheckInCard />
        <DailyQuoteCard />
        <WeeklyRhythmCard
          activeCount={4}
          description='4/7 ngày đã gieo hạt. Hãy giữ nhịp nhẹ nhàng.'
        />
      </SideColumn>
    </MainContainer>
  )
}

export default InnerQuotePage
