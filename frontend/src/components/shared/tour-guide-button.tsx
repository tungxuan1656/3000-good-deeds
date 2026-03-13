import { BookOpenCheckIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'

import {
  OnboardingDialog,
  type OnboardingDialogHandle,
  type OnboardingStep,
} from './onboarding-dialog'

type TourGuideButtonProps = {
  flowTitle: string
  steps: OnboardingStep[]
  label?: string
  className?: string
  autoOpen?: boolean
  storageKey?: string
}

export const TourGuideButton = ({
  flowTitle,
  steps,
  label = 'Tour guide',
  className,
  autoOpen = false,
  storageKey,
}: TourGuideButtonProps) => {
  const onboardingDialogRef = useRef<OnboardingDialogHandle>(null)

  useEffect(() => {
    if (!autoOpen || !storageKey) return
    try {
      const hasSeen = localStorage.getItem(storageKey)
      if (!hasSeen) onboardingDialogRef.current?.open()
    } catch {
      // ignore
    }
  }, [autoOpen, storageKey])

  const handleDialogClose = () => {
    if (!storageKey) return

    try {
      localStorage.setItem(storageKey, 'seen')
    } catch {
      // ignore
    }
  }

  return (
    <>
      <Button
        aria-label={label}
        className={className ?? 'text-muted-foreground hover:text-foreground'}
        size='icon'
        variant='ghost'
        onClick={() => onboardingDialogRef.current?.open()}>
        <BookOpenCheckIcon className='h-4 w-4' />
      </Button>
      <OnboardingDialog
        ref={onboardingDialogRef}
        flowTitle={flowTitle}
        steps={steps}
        onClose={handleDialogClose}
      />
    </>
  )
}
