import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useIsMobile } from '@/hooks/shared'
import { shouldShowPwaInstallGuide } from '@/lib/utils/pwa-install'

import { PWAGuideDialog, type PWAGuideDialogHandle } from '../layout'

export const PWASuggestion = () => {
  const isMobile = useIsMobile()
  const [isVisible, setIsVisible] = useState(false)
  const refPWADialog = useRef<PWAGuideDialogHandle>(null)
  const { t } = useTranslation()

  useEffect(() => {
    setIsVisible(shouldShowPwaInstallGuide(isMobile))
  }, [isMobile])

  if (!isVisible) return null

  return (
    <div className='flex items-center justify-between px-2'>
      <p className='text-muted-foreground/80 text-xs italic'>
        {t('pwa.suggestion.message')}{' '}
        <span
          className='text-primary/80 cursor-pointer underline'
          onClick={() => refPWADialog.current?.open()}>
          {t('pwa.suggestion.viewGuide')}
        </span>
      </p>
      <PWAGuideDialog ref={refPWADialog} autoHandle={false} />
    </div>
  )
}
