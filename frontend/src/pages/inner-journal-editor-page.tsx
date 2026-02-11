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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const InnerJournalEditorPage = () => {
  const [mode, setMode] = useState<'grateful' | 'repent'>('grateful')

  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          description='Chọn cách quán chiếu và viết điều cần nhìn rõ.'
          note='Mọi ghi nhận đều riêng tư.'
          subtitle='Viết nhật ký'
          title='Một trang chánh niệm'
        />

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
          <p className='text-muted-foreground text-sm'>Chỉ mình bạn thấy nội dung này.</p>
          <Button className='h-11 w-full rounded-full'>Lưu lại</Button>
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

export default InnerJournalEditorPage
