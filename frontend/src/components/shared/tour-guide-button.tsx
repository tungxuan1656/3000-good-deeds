import { BookOpenCheckIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { OnboardingDialog, type OnboardingStep } from './onboarding-dialog'

type TourGuideButtonProps = {
  flowTitle: string
  steps: OnboardingStep[]
  label?: string
  className?: string
}

export const TourGuideButton = ({
  flowTitle,
  steps,
  label = 'Tour guide',
  className,
}: TourGuideButtonProps) => {
  const [open, setOpen] = useState(false)

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
      <OnboardingDialog flowTitle={flowTitle} open={open} steps={steps} onOpenChange={setOpen} />
    </>
  )
}
