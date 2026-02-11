import { UserIcon } from 'lucide-react'
import { useMemo } from 'react'

import { CardSection } from '@/components/shared'
import type { UserDTO } from '@/types/api'

interface AccountProfileCardProps {
  user?: UserDTO | null
}

const AccountProfileCard = ({ user }: AccountProfileCardProps) => {
  const displayName = user?.displayName ?? 'Bạn'
  const displayEmail = user?.email ?? 'Chưa có email'
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
            Hồ sơ
          </p>
          <p className='text-foreground mt-2 text-base font-semibold'>Tài khoản của bạn</p>
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
        <div className='text-muted-foreground text-sm'>
          Thông tin này được lấy từ tài khoản đăng nhập.
        </div>
      </div>
    </CardSection>
  )
}

export default AccountProfileCard
