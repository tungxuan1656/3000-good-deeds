import { useEffect, useMemo, useRef } from 'react'

import { useIsMobile } from '@/hooks/use-mobile'
import { getMobileOs, getPwaInstallGuideSteps, shouldShowPwaInstallGuide } from '@/lib/pwa-install'

import { ConfirmDialog, type ConfirmDialogHandle } from '../shared'
import { Button } from '../ui/button'

export const PWAGuideDialog = ({ showIcon }: { showIcon?: boolean }) => {
  const isMobile = useIsMobile()
  const installDialogRef = useRef<ConfirmDialogHandle>(null)
  const mobileOs = useMemo(() => getMobileOs(), [])
  const installSteps = useMemo(() => getPwaInstallGuideSteps(mobileOs), [mobileOs])

  useEffect(() => {
    if (!shouldShowPwaInstallGuide(isMobile)) return

    installDialogRef.current?.open()
  }, [isMobile])

  return (
    <>
      {showIcon ? (
        <Button
          className=''
          size={'sm'}
          variant={'link'}
          onClick={() => installDialogRef.current?.open()}>
          {'Hướng dẫn cài đặt ứng dụng'}
        </Button>
      ) : null}
      <ConfirmDialog
        ref={installDialogRef}
        confirmLabel='Đã hiểu'
        description='Cài ứng dụng để mở nhanh hơn và dùng trải nghiệm giống app trên điện thoại.'
        title='Hướng dẫn cài ứng dụng Web App'
        onCancel={() => installDialogRef.current?.close()}
        onConfirm={() => installDialogRef.current?.close()}>
        <div className='space-y-1 text-sm leading-relaxed'>
          {installSteps.map((step) => (
            <p key={step} className='text-muted-foreground'>
              {step}
            </p>
          ))}
        </div>
      </ConfirmDialog>
    </>
  )
}
