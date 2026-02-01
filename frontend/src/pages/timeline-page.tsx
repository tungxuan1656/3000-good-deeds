import { ChevronRightIcon, ClockIcon, LockIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { CardSection } from '@/components/shared/card-section'

const categoryMeta = {
  body: {
    label: 'Thân',
    icon: '/icons/icon_than.png',
    bg: 'bg-body/20',
  },
  speech: {
    label: 'Khẩu',
    icon: '/icons/icon_khau.png',
    bg: 'bg-speech/20',
  },
  mind: {
    label: 'Ý',
    icon: '/icons/icon_y.png',
    bg: 'bg-mind/20',
  },
}

const timelineGroups = [
  {
    date: 'Hôm nay · 15/10',
    items: [
      {
        id: '1',
        category: 'body' as const,
        time: '08:45',
        note: 'Nhường đường cho người lớn tuổi ở ngã tư.',
        isPrivate: true,
        moods: ['Biết ơn', 'Nhẹ lòng'],
      },
      {
        id: '2',
        category: 'speech' as const,
        time: '12:10',
        note: 'Nói lời cảm ơn với người giao hàng.',
        isPrivate: false,
        moods: ['Ấm áp'],
      },
    ],
  },
  {
    date: 'Hôm qua · 14/10',
    items: [
      {
        id: '3',
        category: 'mind' as const,
        time: '21:05',
        note: 'Nhìn lại ngày với lòng biết ơn và tha thứ.',
        isPrivate: true,
        moods: ['Bình an'],
      },
    ],
  },
]

const isLoading = false

const TimelinePage = () => {
  const isEmpty = !isLoading && timelineGroups.length === 0

  return (
    <div className='mx-auto flex w-full max-w-3xl flex-col gap-4'>
      <CardSection as='header'>
        <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
          Hành trình
        </p>
        <h1 className='text-foreground mt-2 text-2xl font-semibold tracking-tight'>
          Nhật ký việc thiện
        </h1>
        <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
          Nơi lưu giữ những điều tốt đẹp theo dòng thời gian.
        </p>
      </CardSection>

      {isLoading && (
        <div className='flex flex-col gap-4'>
          {[1, 2, 3].map((item) => (
            <div key={item} className='rounded-2xl border border-black/5 bg-white/80 p-4 shadow-sm'>
              <div className='bg-muted mb-3 h-4 w-32 animate-pulse rounded-full' />
              <div className='flex flex-col gap-3'>
                <div className='bg-muted h-16 w-full animate-pulse rounded-2xl' />
                <div className='bg-muted h-16 w-full animate-pulse rounded-2xl' />
              </div>
            </div>
          ))}
        </div>
      )}

      {isEmpty && (
        <CardSection className='flex flex-col items-center justify-center gap-3 text-center'>
          <p className='text-muted-foreground text-sm leading-relaxed'>
            Chưa có việc thiện nào.
            <br />
            Hãy bắt đầu từ một việc nhỏ.
          </p>
        </CardSection>
      )}

      {!isLoading && !isEmpty && (
        <div className='flex flex-col gap-4'>
          {timelineGroups.map((group) => (
            <CardSection key={group.date} className='gap-4'>
              <div className='flex items-center justify-between'>
                <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
                  {group.date}
                </p>
                <span className='text-muted-foreground text-xs'>
                  {group.items.length} việc thiện
                </span>
              </div>
              <div className='flex flex-col gap-3'>
                {group.items.map((item) => {
                  const meta = categoryMeta[item.category]

                  return (
                    <div
                      key={item.id}
                      className='flex flex-col gap-3 rounded-2xl border border-black/5 bg-white/80 p-4 transition-shadow hover:shadow-sm'>
                      <div className='flex items-start justify-between gap-3'>
                        <div className='flex items-center gap-3'>
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-2xl ${meta.bg}`}>
                            <img alt={meta.label} className='h-6 w-6' src={meta.icon} />
                          </div>
                          <div>
                            <p className='text-foreground text-sm font-semibold'>{meta.label}</p>
                            <div className='text-muted-foreground mt-1 flex items-center gap-2 text-xs'>
                              <ClockIcon className='h-3.5 w-3.5' />
                              {item.time}
                              {item.isPrivate && (
                                <span className='flex items-center gap-1'>
                                  <LockIcon className='h-3.5 w-3.5' />
                                  Riêng tư
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Link
                          className='text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs'
                          to={`/deeds/${item.id}`}>
                          Xem
                          <ChevronRightIcon className='h-3.5 w-3.5' />
                        </Link>
                      </div>

                      <p className='text-foreground text-sm leading-relaxed'>{item.note}</p>

                      {item.moods.length > 0 && (
                        <div className='flex flex-wrap gap-2'>
                          {item.moods.map((mood) => (
                            <span
                              key={mood}
                              className='text-muted-foreground rounded-full border border-black/5 bg-white px-3 py-1 text-xs'>
                              {mood}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardSection>
          ))}
        </div>
      )}
    </div>
  )
}

export default TimelinePage
