import {
  BellDotIcon,
  ChevronRightIcon,
  HeartHandshakeIcon,
  TargetIcon,
  UserCogIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  CardSection,
  DailyQuoteCard,
  HeaderSection,
  LegalFooter,
  MiniCheckInCard,
  WeeklyRhythmCard,
} from '@/components/shared'
import { PATHS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const ROWS = [
  {
    title: 'Quản lý tài khoản',
    description: 'Cập nhật hồ sơ, đăng xuất và xóa dữ liệu.',
    icon: UserCogIcon,
    to: PATHS.SETTINGS,
    bgIcon: 'bg-blue-100',
    color: 'text-blue-500',
  },
  {
    title: 'Quản lý thông báo',
    description: 'Bật/tắt nhắc nhở và chỉnh giờ gửi thông báo.',
    icon: BellDotIcon,
    to: PATHS.SETTINGS,
    bgIcon: 'bg-orange-100',
    color: 'text-amber-500',
  },
  {
    title: 'Mục tiêu',
    description: 'Giữ thói quen theo tuần, tháng, năm.',
    icon: TargetIcon,
    to: PATHS.GOALS,
    bgIcon: 'bg-secondary/40',
    color: 'text-primary',
  },
  {
    title: 'Gợi ý việc thiện',
    description: 'Một gợi ý nhỏ để khởi tâm từ bi.',
    icon: HeartHandshakeIcon,
    to: PATHS.INNER_RANDOM_ACTS,
    bgIcon: 'bg-purple-100',
    color: 'text-purple-500',
  },
]

const MorePage = () => {
  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          description='Mục tiêu, gợi ý việc thiện, nhắc nhở và tài khoản của bạn.'
          note='Bạn có thể tuỳ chỉnh theo thói quen của mình.'
          subtitle='Thêm'
          title='Quản lý & tuỳ chỉnh'
        />

        <CardSection className='gap-5'>
          {ROWS.map(({ description, icon: Icon, title, to, bgIcon, color }) => (
            <Link key={title} to={to}>
              <div className='flex flex-row items-center gap-4'>
                <div
                  className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', bgIcon)}>
                  <Icon className={cn('text-primary h-5 w-5', color)} />
                </div>
                <div className='flex-1'>
                  <p className='text-foreground text-base font-semibold'>{title}</p>
                  <p className='text-muted-foreground mt-1 text-sm'>{description}</p>
                </div>
                <ChevronRightIcon className='text-muted-foreground' size={20} />
              </div>
            </Link>
          ))}
        </CardSection>

        <LegalFooter />
      </MainColumn>

      <SideColumn hideInMobile>
        <MiniCheckInCard />
        <DailyQuoteCard />
        <WeeklyRhythmCard />
      </SideColumn>
    </MainContainer>
  )
}

export default MorePage
