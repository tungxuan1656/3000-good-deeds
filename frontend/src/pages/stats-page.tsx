import { BarChart3Icon, CalendarIcon, TrendingUpIcon } from 'lucide-react'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import { CardSection } from '@/components/shared/card-section'
import { DailyQuoteCard } from '@/components/shared/daily-quote-card'
import { MiniCheckInCard } from '@/components/shared/mini-check-in-card'

const isLoading = false
const isEmpty = false

const summaryCards = [
  {
    title: 'Tổng việc thiện',
    value: '86',
    helper: 'Tăng 12% so với tháng trước',
    icon: TrendingUpIcon,
  },
  {
    title: 'Chuỗi ngày',
    value: '5 ngày',
    helper: 'Giữ nhịp dịu dàng',
    icon: CalendarIcon,
  },
  {
    title: 'Nhịp tuần',
    value: '4/7',
    helper: 'Đã gieo hạt trong tuần',
    icon: BarChart3Icon,
  },
]

const categoryStats = [
  { label: 'Thân', value: 36, color: 'bg-body/60' },
  { label: 'Khẩu', value: 28, color: 'bg-speech/60' },
  { label: 'Ý', value: 22, color: 'bg-mind/60' },
]

const total = categoryStats.reduce((sum, item) => sum + item.value, 0)

const StatsPage = () => {
  return (
    <MainContainer>
      <MainColumn>
        <CardSection as='header' className='gap-3'>
          <p className='text-muted-foreground text-[11px] font-semibold tracking-[0.24em] uppercase sm:text-xs'>
            Thống kê
          </p>
          <h1 className='text-foreground text-[26px] font-semibold tracking-tight sm:text-[30px]'>
            Nhìn lại hành trình
          </h1>
          <p className='text-muted-foreground/90 max-w-2xl text-sm leading-relaxed sm:text-base'>
            Một góc nhỏ để thấy rõ nhịp điệu thiện lành của bạn.
          </p>
        </CardSection>

        <div className='flex flex-wrap items-center gap-2'>
          <button className='text-foreground rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold shadow-[0_6px_18px_rgba(0,0,0,0.06)]'>
            Tuần này
          </button>
          <button className='text-muted-foreground hover:text-foreground rounded-full border border-black/5 bg-white/70 px-4 py-1.5 text-xs font-semibold'>
            Tháng này
          </button>
        </div>

        {isLoading && (
          <div className='flex flex-col gap-4'>
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className='rounded-2xl border border-black/5 bg-white/80 p-4 shadow-sm'>
                <div className='bg-muted mb-3 h-4 w-32 animate-pulse rounded-full' />
                <div className='bg-muted h-24 w-full animate-pulse rounded-2xl' />
              </div>
            ))}
          </div>
        )}

        {isEmpty && !isLoading && (
          <CardSection className='text-muted-foreground text-center text-sm'>
            Chưa có dữ liệu thống kê. Hãy ghi nhận vài việc thiện đầu tiên.
          </CardSection>
        )}

        {!isEmpty && !isLoading && (
          <div className='flex flex-col gap-5'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {summaryCards.map((card) => {
                const Icon = card.icon

                return (
                  <CardSection
                    key={card.title}
                    className='gap-3 border border-black/5 bg-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.06)]'>
                    <div className='flex items-center justify-between gap-3'>
                      <p className='text-muted-foreground text-[11px] font-semibold tracking-[0.2em] uppercase sm:text-xs'>
                        {card.title}
                      </p>
                      <div className='bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full'>
                        <Icon className='h-4 w-4' />
                      </div>
                    </div>
                    <p className='text-foreground text-[28px] leading-tight font-semibold sm:text-3xl'>
                      {card.value}
                    </p>
                    <p className='text-muted-foreground text-xs sm:text-sm'>{card.helper}</p>
                  </CardSection>
                )
              })}
            </div>

            <CardSection className='gap-2'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-foreground text-base font-semibold'>Phân bố Thân/Khẩu/Ý</p>
                  <p className='text-muted-foreground mt-1 text-xs'>Tổng {total} việc thiện</p>
                </div>
                <span className='text-muted-foreground bg-muted/70 rounded-full px-3 py-1 text-xs'>
                  Tuần này
                </span>
              </div>
              <p className='text-muted-foreground text-xs'>
                Tuần này bạn gieo nhiều thiện qua hành động và lời nói.
              </p>
              <div className='flex flex-col gap-3'>
                {categoryStats.map((item) => (
                  <div key={item.label} className='flex items-center gap-3'>
                    <span className='text-muted-foreground w-10 text-xs font-semibold'>
                      {item.label}
                    </span>
                    <div className='bg-muted/80 h-2.5 w-full rounded-full'>
                      <div
                        className={`${item.color} h-2.5 rounded-full`}
                        style={{ width: `${Math.round((item.value / total) * 100)}%` }}
                      />
                    </div>
                    <span className='text-muted-foreground w-12 text-right text-xs'>
                      {item.value}
                    </span>
                    <span className='text-muted-foreground w-12 text-right text-[11px]'>
                      {Math.round((item.value / total) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </CardSection>

            <CardSection className='gap-2'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-foreground text-base font-semibold'>Chuỗi thiện lành</p>
                  <p className='text-muted-foreground mt-1 text-xs'>Giữ nhịp đều đặn mỗi ngày</p>
                </div>
                <span className='text-foreground text-sm font-semibold'>5 ngày</span>
              </div>
              <div className='bg-muted/80 h-2.5 w-full rounded-full'>
                <div className='bg-primary/70 h-2.5 w-[70%] rounded-full' />
              </div>
              <p className='text-muted-foreground text-xs'>
                Còn 2 ngày nữa để hoàn tất mục tiêu tuần.
              </p>
            </CardSection>
          </div>
        )}
      </MainColumn>

      <SideColumn>
        <MiniCheckInCard />
        <DailyQuoteCard />
      </SideColumn>
    </MainContainer>
  )
}

export default StatsPage
