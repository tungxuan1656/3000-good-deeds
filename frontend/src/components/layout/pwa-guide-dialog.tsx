import React, { useEffect, useMemo, useRef } from 'react'

import { useIsMobile } from '@/hooks/shared/use-mobile'
import { t } from '@/lib/i18n'
import {
  getMobileOs,
  getPwaInstallGuideSteps,
  shouldShowPwaInstallGuide,
} from '@/lib/utils/pwa-install'

import { ConfirmDialog, type ConfirmDialogHandle } from '../shared'

const PWA_GUIDE_DIALOG_LAST_SHOWN_KEY = 'pwaGuideDialogLastShown'
const ONE_DAY_MS = 24 * 60 * 60 * 1000 // 1 day in milliseconds

/**
 * Check if enough time has passed (1 day) since the last PWA guide display
 * Returns true if we should show, false if we should skip due to cooldown
 */
const isShowPwaGuideDue = (): boolean => {
  const lastShownTimestamp = localStorage.getItem(
    PWA_GUIDE_DIALOG_LAST_SHOWN_KEY,
  )

  if (!lastShownTimestamp) {
    return true // Never shown before
  }

  const lastShown = parseInt(lastShownTimestamp, 10)
  const now = Date.now()

  return now - lastShown >= ONE_DAY_MS
}

/**
 * Save current timestamp when PWA guide is shown
 */
const savePwaGuideLaunchTime = (): void => {
  localStorage.setItem(PWA_GUIDE_DIALOG_LAST_SHOWN_KEY, Date.now().toString())
}

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
    if (!isShowPwaGuideDue()) return

    savePwaGuideLaunchTime()
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
