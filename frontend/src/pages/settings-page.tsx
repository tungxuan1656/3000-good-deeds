import { useEffect } from 'react'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import AccountProfileCard from '@/components/settings/account-profile-card'
import DeleteAccountCard from '@/components/settings/delete-account-card'
import NotificationSettingsCard from '@/components/settings/notification-settings-card'
import SessionCard from '@/components/settings/session-card'
import {
  DailyQuoteCard,
  HeaderSection,
  LegalFooter,
  MiniCheckInCard,
  WeeklyRhythmCard,
} from '@/components/shared'
import { useUser } from '@/hooks/api/use-user'
import { t } from '@/lib/i18n'
import { authActions, useAuthStore } from '@/stores/auth-store'

const SettingsPage = () => {
  const userFromStore = useAuthStore.use.user()
  const { data: userResponse } = useUser()

  const user = userResponse?.data ?? userFromStore

  useEffect(() => {
    if (user) {
      authActions.setUser(user)
    }
  }, [user])

  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          description={t('settings.header.description')}
          note={t('settings.header.note')}
          subtitle={t('settings.header.subtitle')}
          title={t('settings.header.title')}
        />

        <AccountProfileCard user={user} />

        <NotificationSettingsCard user={user} />
        <SessionCard />
        <DeleteAccountCard />

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

export default SettingsPage
