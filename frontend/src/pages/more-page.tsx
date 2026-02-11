import { HeartHandshakeIcon, TargetIcon } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { logout } from '@/api/auth'
import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import AccountProfileCard from '@/components/settings/account-profile-card'
import DeleteAccountCard from '@/components/settings/delete-account-card'
import NotificationSettingsCard from '@/components/settings/notification-settings-card'
import SessionCard from '@/components/settings/session-card'
import {
  CardSection,
  DailyQuoteCard,
  HeaderSection,
  MiniCheckInCard,
  WeeklyRhythmCard,
} from '@/components/shared'
import { useUser } from '@/hooks/api/use-user'
import { PATHS } from '@/lib/constants'
import { authActions, useAuthStore } from '@/stores/auth-store'

const MorePage = () => {
  const navigate = useNavigate()
  const userFromStore = useAuthStore.use.user()
  const refreshToken = useAuthStore.use.refreshToken()
  const { data: userResponse } = useUser()

  const user = userResponse?.data ?? userFromStore

  useEffect(() => {
    if (user) {
      authActions.setUser(user)
    }
  }, [user])

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await logout(refreshToken)
      }
    } catch {
      // Ignore logout errors and still clear local state
    } finally {
      authActions.logout()
      navigate(PATHS.LOGIN, { replace: true })
    }
  }

  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          description='Mục tiêu, gợi ý việc thiện, nhắc nhở và tài khoản của bạn.'
          note='Bạn có thể tuỳ chỉnh theo thói quen của mình.'
          subtitle='Thêm'
          title='Quản lý & tuỳ chỉnh'
        />

        <CardSection className='gap-4'>
          <p className='text-foreground text-base font-semibold'>Lối tắt</p>
          <div className='flex flex-col gap-3'>
            <Link
              className='flex items-center gap-4 rounded-2xl border border-black/5 bg-white/80 px-4 py-4 transition-colors hover:bg-white'
              to={PATHS.GOALS}>
              <div className='bg-secondary/40 flex h-12 w-12 items-center justify-center rounded-2xl'>
                <TargetIcon className='text-primary h-5 w-5' />
              </div>
              <div className='flex-1'>
                <p className='text-foreground text-base font-semibold'>Mục tiêu</p>
                <p className='text-muted-foreground mt-1 text-sm'>
                  Giữ thói quen theo tuần, tháng, năm.
                </p>
              </div>
            </Link>

            <Link
              className='flex items-center gap-4 rounded-2xl border border-black/5 bg-white/80 px-4 py-4 transition-colors hover:bg-white'
              to={PATHS.INNER_RANDOM_ACTS}>
              <div className='bg-secondary/40 flex h-12 w-12 items-center justify-center rounded-2xl'>
                <HeartHandshakeIcon className='text-primary h-5 w-5' />
              </div>
              <div className='flex-1'>
                <p className='text-foreground text-base font-semibold'>Gợi ý việc thiện</p>
                <p className='text-muted-foreground mt-1 text-sm'>
                  Một gợi ý nhỏ để khởi tâm từ bi.
                </p>
              </div>
            </Link>
          </div>
        </CardSection>

        <NotificationSettingsCard user={user} />
        <AccountProfileCard user={user} />
        <SessionCard onLogout={handleLogout} />
        <DeleteAccountCard />
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
