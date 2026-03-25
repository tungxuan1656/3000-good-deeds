import { useEffect, useMemo, useRef } from 'react'

import { useIsMobile } from '@/hooks/shared/use-mobile'
import { t } from '@/lib/i18n'
import {
  getMobileOs,
  getPwaInstallGuideSteps,
  shouldShowPwaInstallGuide,
} from '@/lib/utils/pwa-install'

import { ConfirmDialog, type ConfirmDialogHandle } from '../shared'
import { Button } from '../ui/button'

export const PWAGuideDialog = ({ showIcon }: { showIcon?: boolean }) => {
  const isMobile = useIsMobile()
  const installDialogRef = useRef<ConfirmDialogHandle>(null)
  const mobileOs = useMemo(() => getMobileOs(), [])
  const installSteps = useMemo(
    () => getPwaInstallGuideSteps(mobileOs),
    [mobileOs],
  )

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
          {t('pwa.guide.openAction')}
        </Button>
      ) : null}
      <ConfirmDialog
        ref={installDialogRef}
        confirmLabel={t('pwa.guide.confirm')}
        description={t('pwa.guide.description')}
        title={t('pwa.guide.title')}
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
