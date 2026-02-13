import { CardSection } from '@/components/shared'

import { LogoutButton } from './logout-button'

const SessionCard = () => {
  return (
    <CardSection className='gap-4'>
      <div>
        <p className='text-foreground text-base font-semibold'>Phiên đăng nhập</p>
        <p className='text-muted-foreground mt-1 text-sm'>Quản lý đăng nhập của bạn.</p>
        <p className='text-muted-foreground mt-1 text-sm'>Đăng xuất không xoá dữ liệu.</p>
      </div>
      <LogoutButton
        className='text-foreground h-11 w-full rounded-full border border-black/5 bg-white hover:bg-white/80'
        variant='secondary'
      />
    </CardSection>
  )
}

export default SessionCard
