import { GiftIcon, LockIcon, SparklesIcon } from 'lucide-react'
import { useState } from 'react'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import { CardSection } from '@/components/shared/card-section'
import { DailyQuoteCard } from '@/components/shared/daily-quote-card'
import { HeaderSection } from '@/components/shared/header-section'
import { MiniCheckInCard } from '@/components/shared/mini-check-in-card'
import { WeeklyRhythmCard } from '@/components/shared/weekly-rhythm-card'
import { Button } from '@/components/ui/button'

const achievements = [
  {
    id: 'a1',
    title: 'Bước đầu tiên',
    description: 'Ghi nhận việc thiện đầu tiên',
    date: '10/10/2026',
    isUnlocked: true,
  },
  {
    id: 'a2',
    title: '7 ngày liên tục',
    description: 'Duy trì 7 ngày liên tiếp',
    date: '15/10/2026',
    isUnlocked: true,
  },
  {
    id: 'a3',
    title: 'Lời nói ấm áp',
    description: '10 việc thiện thuộc Khẩu',
    date: null,
    isUnlocked: false,
  },
  {
    id: 'a4',
    title: 'Tâm ý hiền hòa',
    description: '10 việc thiện thuộc Ý',
    date: null,
    isUnlocked: false,
  },
  {
    id: 'a5',
    title: 'Bàn tay sẻ chia',
    description: '20 việc thiện thuộc Thân',
    date: null,
    isUnlocked: false,
  },
  {
    id: 'a6',
    title: '30 ngày bền bỉ',
    description: 'Duy trì 30 ngày liên tiếp',
    date: null,
    isUnlocked: false,
  },
]

const AchievementsPage = () => {
  const [showNewUnlock, setShowNewUnlock] = useState(true)

  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          description='Mỗi huy hiệu là một dấu mốc nuôi dưỡng tâm.'
          subtitle='Dấu mốc'
          title='Những dấu mốc tu tập'
        />

        {showNewUnlock && (
          <CardSection className='border border-amber-200/60 bg-amber-50/70'>
            <div className='flex items-start gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-amber-100'>
                <SparklesIcon className='h-5 w-5 text-amber-600' />
              </div>
              <div className='flex-1'>
                <p className='text-foreground text-sm font-semibold'>
                  Bạn vừa mở khoá huy hiệu mới
                </p>
                <p className='text-muted-foreground mt-1 text-xs'>7 ngày dịu dàng</p>
                <Button
                  className='mt-3 h-9 rounded-full px-4 text-xs'
                  onClick={() => setShowNewUnlock(false)}>
                  Tuyệt quá
                </Button>
              </div>
            </div>
          </CardSection>
        )}

        <CardSection className='gap-4'>
          <div className='flex items-center justify-between'>
            <p className='text-foreground text-base font-semibold'>Bộ sưu tập huy hiệu</p>
            <span className='text-muted-foreground text-xs'>2/6 đã mở</span>
          </div>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {achievements.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col gap-3 rounded-2xl border border-black/5 p-4 ${
                  item.isUnlocked ? 'bg-white/80' : 'bg-muted/40'
                }`}>
                <div className='flex items-center justify-between'>
                  <div className='flex h-11 w-11 items-center justify-center rounded-full bg-white'>
                    {item.isUnlocked ? (
                      <GiftIcon className='text-primary h-5 w-5' />
                    ) : (
                      <LockIcon className='text-muted-foreground h-5 w-5' />
                    )}
                  </div>
                  {item.isUnlocked && (
                    <span className='text-muted-foreground text-[10px] font-semibold uppercase'>
                      Đã mở
                    </span>
                  )}
                </div>
                <div>
                  <p className='text-foreground text-sm font-semibold'>{item.title}</p>
                  <p className='text-muted-foreground mt-1 text-xs leading-relaxed'>
                    {item.description}
                  </p>
                </div>
                <div className='text-muted-foreground text-[11px]'>
                  {item.isUnlocked ? `Mở khoá: ${item.date}` : 'Chưa đạt'}
                </div>
              </div>
            ))}
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

export default AchievementsPage
