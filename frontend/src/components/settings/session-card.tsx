import { LogOutIcon } from 'lucide-react'
import { useRef } from 'react'

import { CardSection, ConfirmDialog } from '@/components/shared'
import type { ConfirmDialogHandle } from '@/components/shared/confirm-dialog'
import { Button } from '@/components/ui/button'

interface SessionCardProps {
  onLogout: () => void
}

const SessionCard = ({ onLogout }: SessionCardProps) => {
  const logoutDialogRef = useRef<ConfirmDialogHandle>(null)

  return (
    <>
      <CardSection className='gap-4'>
        <div>
          <p className='text-foreground text-base font-semibold'>Phiên đăng nhập</p>
          <p className='text-muted-foreground mt-1 text-xs'>Quản lý đăng nhập của bạn.</p>
        </div>
        <Button
          className='text-foreground h-11 w-full rounded-full border border-black/5 bg-white hover:bg-white/80'
          variant='secondary'
          onClick={() => logoutDialogRef.current?.open()}>
          <LogOutIcon className='h-4 w-4' />
          Đăng xuất
        </Button>
      </CardSection>

      <ConfirmDialog
        ref={logoutDialogRef}
        cancelLabel='Để sau'
        confirmLabel='Đăng xuất'
        description='Bạn có thể đăng nhập lại bất cứ lúc nào.'
        title='Đăng xuất khỏi tài khoản?'
        onConfirm={() => {
          logoutDialogRef.current?.close()
          onLogout()
        }}
      />
    </>
  )
}

export default SessionCard
