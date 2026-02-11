import { BookOpenCheckIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

import { OnboardingDialog, type OnboardingStep } from './onboarding-dialog'

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
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!autoOpen || !storageKey) return
    try {
      const hasSeen = localStorage.getItem(storageKey)
      if (!hasSeen) setOpen(true)
    } catch {
      // ignore
    }
  }, [autoOpen, storageKey])

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen && storageKey) {
      try {
        localStorage.setItem(storageKey, 'seen')
      } catch {
        // ignore
      }
    }
  }

  return (
    <>
      <Button
        aria-label={label}
        className={className ?? 'text-muted-foreground hover:text-foreground'}
        size='icon'
        variant='ghost'
        onClick={() => setOpen(true)}>
        <BookOpenCheckIcon className='h-4 w-4' />
      </Button>
      <OnboardingDialog
        flowTitle={flowTitle}
        open={open}
        steps={steps}
        onOpenChange={handleOpenChange}
      />
    </>
  )
}
