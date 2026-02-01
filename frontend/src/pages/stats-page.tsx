import { BarChart3Icon, CalendarIcon, TrendingUpIcon } from 'lucide-react'

import { CardSection } from '@/components/shared/card-section'

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
    <div className='mx-auto flex w-full max-w-3xl flex-col gap-6'>
      <CardSection as='header'>
        <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
          Thống kê
        </p>
        <h1 className='text-foreground mt-2 text-2xl font-semibold'>Nhìn lại hành trình</h1>
        <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
          Một góc nhỏ để thấy rõ nhịp điệu thiện lành của bạn.
        </p>
      </CardSection>

      <div className='flex flex-wrap items-center gap-2'>
        <button className='text-foreground rounded-full border border-black/5 bg-white px-4 py-1.5 text-xs font-semibold'>
          Tuần này
        </button>
        <button className='text-muted-foreground rounded-full border border-black/5 bg-white/60 px-4 py-1.5 text-xs font-semibold'>
          Tháng này
        </button>
      </div>

      {isLoading && (
        <div className='flex flex-col gap-4'>
          {[1, 2, 3].map((item) => (
            <div key={item} className='rounded-2xl border border-black/5 bg-white/80 p-4 shadow-sm'>
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
        <div className='flex flex-col gap-6'>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {summaryCards.map((card) => {
              const Icon = card.icon
              return (
                <CardSection key={card.title} className='gap-3'>
                  <div className='flex items-center justify-between'>
                    <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
                      {card.title}
                    </p>
                    <div className='bg-secondary/40 flex h-9 w-9 items-center justify-center rounded-full'>
                      <Icon className='text-primary h-4 w-4' />
                    </div>
                  </div>
                  <p className='text-foreground text-2xl font-semibold'>{card.value}</p>
                  <p className='text-muted-foreground text-xs'>{card.helper}</p>
                </CardSection>
              )
            })}
          </div>

          <CardSection className='gap-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-foreground text-base font-semibold'>Phân bố Thân/Khẩu/Ý</p>
                <p className='text-muted-foreground mt-1 text-xs'>Tổng {total} việc thiện</p>
              </div>
              <span className='text-muted-foreground text-xs'>Tuần này</span>
            </div>
            <div className='flex flex-col gap-3'>
              {categoryStats.map((item) => (
                <div key={item.label} className='flex items-center gap-3'>
                  <span className='text-muted-foreground w-10 text-xs font-semibold'>
                    {item.label}
                  </span>
                  <div className='bg-muted h-2.5 w-full rounded-full'>
                    <div
                      className={`${item.color} h-2.5 rounded-full`}
                      style={{ width: `${Math.round((item.value / total) * 100)}%` }}
                    />
                  </div>
                  <span className='text-muted-foreground w-10 text-right text-xs'>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardSection>

          <CardSection className='gap-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-foreground text-base font-semibold'>Chuỗi thiện lành</p>
                <p className='text-muted-foreground mt-1 text-xs'>Giữ nhịp đều đặn mỗi ngày</p>
              </div>
              <span className='text-foreground text-sm font-semibold'>5 ngày</span>
            </div>
            <div className='bg-muted h-2.5 w-full rounded-full'>
              <div className='bg-primary/70 h-2.5 w-[70%] rounded-full' />
            </div>
            <p className='text-muted-foreground text-xs'>
              Còn 2 ngày nữa để hoàn tất mục tiêu tuần.
            </p>
          </CardSection>
        </div>
      )}
    </div>
  )
}

export default StatsPage
