import React, { useEffect, useMemo, useRef } from 'react'

import { useIsMobile } from '@/hooks/shared/use-mobile'
import { t } from '@/lib/i18n'
import {
  getMobileOs,
  getPwaInstallGuideSteps,
  shouldShowPwaInstallGuide,
} from '@/lib/utils/pwa-install'

import { ConfirmDialog, type ConfirmDialogHandle } from '../shared'

type PWAGuideDialogProps = {
  autoHandle?: boolean
}

export type PWAGuideDialogHandle = {
  open: () => void
  close: () => void
}

export const PWAGuideDialog = React.forwardRef<
  PWAGuideDialogHandle,
  PWAGuideDialogProps
>(({ autoHandle = true }, ref) => {
  const isMobile = useIsMobile()
  const installDialogRef = useRef<ConfirmDialogHandle>(null)
  const mobileOs = useMemo(() => getMobileOs(), [])
  const installSteps = useMemo(
    () => getPwaInstallGuideSteps(mobileOs),
    [mobileOs],
  )

  useEffect(() => {
    if (!autoHandle) return
    if (!shouldShowPwaInstallGuide(isMobile)) return

    installDialogRef.current?.open()
  }, [isMobile, autoHandle])

  React.useImperativeHandle(ref, () => ({
    open: () => installDialogRef.current?.open(),
    close: () => installDialogRef.current?.close(),
  }))

  return (
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
  )
})
