import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { logout } from '@/api/auth'
import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import AccountProfileCard from '@/components/settings/account-profile-card'
import DeleteAccountCard from '@/components/settings/delete-account-card'
import NotificationSettingsCard from '@/components/settings/notification-settings-card'
import SessionCard from '@/components/settings/session-card'
import {
  DailyQuoteCard,
  HeaderSection,
  MiniCheckInCard,
  WeeklyRhythmCard,
} from '@/components/shared'
import { useUser } from '@/hooks/api/use-user'
import { PATHS } from '@/lib/constants'
import { authActions, useAuthStore } from '@/stores/auth-store'

const SettingsPage = () => {
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
          description='Điều chỉnh nhắc nhở và tài khoản để giữ nếp sống chánh niệm.'
          subtitle='Cài đặt'
          title='Tuỳ chỉnh trải nghiệm'
        />

        <AccountProfileCard user={user} />

        <NotificationSettingsCard user={user} />
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

export default SettingsPage
