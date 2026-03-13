import { UserIcon } from 'lucide-react'
import { useMemo } from 'react'

import { CardSection } from '@/components/shared'
import { t } from '@/lib/i18n'
import type { UserDTO } from '@/types/api'

interface AccountProfileCardProps {
  user?: UserDTO | null
}

const AccountProfileCard = ({ user }: AccountProfileCardProps) => {
  const displayName = user?.displayName ?? t('layout.user.fallbackName')
  const displayEmail = user?.email ?? t('layout.user.emailMissing')
  const avatarUrl = user?.avatarUrl
  const initials = useMemo(() => {
    const nameSource = displayName || displayEmail
    const parts = nameSource.trim().split(' ').filter(Boolean)
    const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase())

    return letters.join('') || 'U'
  }, [displayEmail, displayName])

  return (
    <CardSection className='gap-4'>
      <div className='flex justify-between'>
        <div>
          <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
            {t('settings.account.heading')}
          </p>
          <p className='text-foreground mt-2 text-base font-semibold'>
            {t('settings.account.title')}
          </p>
        </div>
        <div className='flex justify-center rounded-full'>
          <UserIcon className='text-primary h-5 w-5' />
        </div>
      </div>

      <div className='flex flex-col gap-3 rounded-2xl border border-black/5 bg-white/80 p-4'>
        <div className='flex items-center gap-4'>
          <div className='bg-muted text-muted-foreground flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold'>
            {avatarUrl ? (
              <img alt={displayName} className='h-full w-full rounded-full' src={avatarUrl} />
            ) : (
              initials
            )}
          </div>
          <div>
            <p className='text-foreground text-sm font-semibold'>{displayName}</p>
            <p className='text-muted-foreground text-xs'>{displayEmail}</p>
          </div>
        </div>
        <div className='text-muted-foreground text-sm'>{t('settings.account.helper')}</div>
      </div>
    </CardSection>
  )
}

export default AccountProfileCard
