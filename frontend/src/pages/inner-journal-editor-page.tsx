import { useState } from 'react'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import { CardSection } from '@/components/shared/card-section'
import { DailyQuoteCard } from '@/components/shared/daily-quote-card'
import { MiniCheckInCard } from '@/components/shared/mini-check-in-card'
import { WeeklyRhythmCard } from '@/components/shared/weekly-rhythm-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const InnerJournalEditorPage = () => {
  const [mode, setMode] = useState<'grateful' | 'repent'>('grateful')

  return (
    <MainContainer>
      <MainColumn>
        <CardSection as='header'>
          <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
            Viết nhật ký
          </p>
          <h1 className='text-foreground mt-2 text-2xl font-semibold tracking-tight'>
            Một trang nhẹ nhàng
          </h1>
          <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
            Chọn chế độ và viết điều bạn muốn giữ lại.
          </p>
        </CardSection>

        <CardSection className={`gap-4 ${mode === 'repent' ? 'bg-muted/60' : ''}`}>
          <div className='flex flex-wrap gap-2'>
            <button
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                mode === 'grateful'
                  ? 'border-primary/40 bg-primary/15 text-primary'
                  : 'text-muted-foreground border-black/5 bg-white'
              }`}
              type='button'
              onClick={() => setMode('grateful')}>
              Biết ơn
            </button>
            <button
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                mode === 'repent'
                  ? 'border-primary/40 bg-primary/15 text-primary'
                  : 'text-muted-foreground border-black/5 bg-white'
              }`}
              type='button'
              onClick={() => setMode('repent')}>
              Sám hối
            </button>
          </div>
          <Input
            className='rounded-2xl border border-black/5 bg-white px-4 py-2 text-sm'
            placeholder='Tiêu đề'
          />
          <Textarea
            className='min-h-44 w-full resize-none rounded-2xl bg-white px-4 py-3 text-sm leading-relaxed'
            placeholder='Hôm nay mình...'
          />
          <p className='text-muted-foreground text-xs'>Chỉ mình bạn thấy nội dung này.</p>
          <Button className='h-11 w-full rounded-full'>Lưu nhật ký</Button>
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

export default InnerJournalEditorPage
