import * as React from 'react'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useCreateDeed } from '@/hooks/api/use-deeds'
import { useIsMobile } from '@/hooks/shared/use-mobile'
import { INFO_COPY } from '@/lib/constants/info-copy'
import { t } from '@/lib/i18n'
import { useCheckInStore } from '@/stores/check-in.store'

import { CheckInSheetFlow } from './check-in-sheet-flow'
import { CheckInSheetTip } from './check-in-sheet-tip'
import { InfoButton } from './info-button'

export const CheckInSheet = () => {
  const isMobile = useIsMobile()
  const createDeed = useCreateDeed()

  const isOpen = useCheckInStore.use.isOpen()
  const close = useCheckInStore.use.close()

  const [step, setStep] = React.useState(1)
  const [resetSeed, setResetSeed] = React.useState(0)

  // Reset step and seed when opening
  React.useEffect(() => {
    if (isOpen) {
      setStep(1)
      setResetSeed((prev) => prev + 1)
    }
  }, [isOpen])

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent
        className={isMobile ? 'rounded-t-2xl' : ''}
        side={isMobile ? 'bottom' : 'right'}>
        <SheetHeader>
          <div className='flex items-center gap-1 pr-4'>
            <SheetTitle>{t('checkIn.sheet.title')}</SheetTitle>
            <InfoButton
              description={INFO_COPY.deeds.description}
              title={INFO_COPY.deeds.title}
            />
          </div>
          <SheetDescription>
            {step === 1 && t('checkIn.sheet.stepDescription.2')}
            {step === 2 && t('checkIn.sheet.stepDescription.3')}
          </SheetDescription>
        </SheetHeader>

        <CheckInSheetFlow
          createDeed={createDeed}
          resetSeed={resetSeed}
          setStep={setStep}
          step={step}
          onClose={close}
        />

        <div className='px-4 pb-4'>
          <CheckInSheetTip />
        </div>
      </SheetContent>
    </Sheet>
  )
}
