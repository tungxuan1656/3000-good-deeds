'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { deleteMe } from '@/api/user'
import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  AccountProfileCard,
  DeleteAccountCard,
  NotificationSettingsCard,
  PasswordSecurityCard,
  PWASuggestion,
  SessionCard,
} from '@/components/settings'
import {
  DailyQuoteCard,
  KindnessSuggestionCard,
  MiniCheckInCard,
  PageHeader,
  WeeklyRhythmCard,
} from '@/components/shared'
import { useUser } from '@/hooks/api/use-user'
import { useAuthProvider } from '@/hooks/auth/use-auth-provider'
import { PATHS } from '@/lib/constants'
import { t } from '@/lib/i18n'
import { unsubscribeFromPushNotifications } from '@/lib/utils/push-notifications'
import { authActions, useAuthStore } from '@/stores/auth.store'

import { executeDeleteAccountFlow } from './settings-page-account-deletion'

const MorePage = () => {
  const router = useRouter()
  const { deleteCurrentFirebaseUser } = useAuthProvider()
  const userFromStore = useAuthStore.use.user()
  const { data: userResponse } = useUser()
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  const user = userResponse?.data ?? userFromStore

  useEffect(() => {
    if (user) {
      authActions.setUser(user)
    }
  }, [user])

  const handleDeleteAccount = async () => {
    if (isDeletingAccount) {
      return
    }

    try {
      setIsDeletingAccount(true)

      await executeDeleteAccountFlow({
        deleteCurrentFirebaseUser,
        unsubscribeFromPushNotifications,
        deleteMe,
        logout: authActions.logout,
        navigateToLogin: () => router.replace(PATHS.LOGIN),
        toastSuccess: toast.success,
        toastError: toast.error,
      })
    } finally {
      setIsDeletingAccount(false)
    }
  }

  return (
    <MainContainer>
      <MainColumn>
        <PageHeader
          description={t('pages.more.header.description')}
          title={t('pages.more.header.title')}
        />

        <PWASuggestion />

        <AccountProfileCard user={user} />
        <NotificationSettingsCard user={user} />
        <PasswordSecurityCard />
        <SessionCard />
        <DeleteAccountCard onConfirm={handleDeleteAccount} />
      </MainColumn>

      <SideColumn hideInMobile>
        <MiniCheckInCard />
        <DailyQuoteCard />
        <KindnessSuggestionCard />
        <WeeklyRhythmCard />
      </SideColumn>
    </MainContainer>
  )
}

export default MorePage
