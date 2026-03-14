import { useEffect } from 'react'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  AccountProfileCard,
  DeleteAccountCard,
  NotificationSettingsCard,
  PasswordSecurityCard,
  SessionCard,
} from '@/components/settings'
import {
  DailyQuoteCard,
  HeaderSection,
  LegalFooter,
  MiniCheckInCard,
  WeeklyRhythmCard,
} from '@/components/shared'
import { useUser } from '@/hooks/api/use-user'
import { t } from '@/lib/i18n'
import { authActions, useAuthStore } from '@/stores/auth.store'

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
        <PasswordSecurityCard />
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
