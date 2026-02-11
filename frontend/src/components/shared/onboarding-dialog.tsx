import { XIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export type OnboardingStep = {
  image: string
  title: string
  description: string
}

type OnboardingDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  flowTitle: string
  steps: OnboardingStep[]
  className?: string
}

export const OnboardingDialog = ({
  open,
  onOpenChange,
  flowTitle,
  steps,
  className,
}: OnboardingDialogProps) => {
  const [index, setIndex] = useState(0)

  const step = useMemo(() => steps[index], [index, steps])
  const isLast = index === steps.length - 1

  const handleClose = () => {
    setIndex(0)
    onOpenChange(false)
  }

  const handleNext = () => {
    if (isLast) {
      handleClose()

      return
    }
    setIndex((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handlePrev = () => {
    setIndex((prev) => Math.max(prev - 1, 0))
  }

  if (!step) return null

  return (
    <Dialog modal={true} open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('gap-4 sm:gap-5', className)} showCloseButton={false}>
        <DialogHeader className='gap-1'>
          <p className='text-muted-foreground text-xs font-medium tracking-widest uppercase'>
            {flowTitle}
          </p>
          <DialogTitle className='text-base font-semibold'>{step.title}</DialogTitle>
          <div className='absolute top-4 right-4 rounded-full bg-gray-200 p-1'>
            <XIcon className='text-muted-foreground/60 size-4' onClick={handleClose} />
          </div>
        </DialogHeader>

        <div className='flex flex-col items-center gap-4'>
          <div className='flex w-full items-center justify-center overflow-hidden rounded-3xl'>
            <img alt={step.title} className='h-80 max-h-80 w-full object-cover' src={step.image} />
          </div>
          <p className='text-foreground text-sm leading-relaxed'>{step.description}</p>
        </div>

        <div className='flex items-center justify-center gap-2'>
          {steps.map((_, dotIndex) => (
            <span
              key={dotIndex}
              className={cn(
                'h-2 w-2 rounded-full',
                dotIndex === index ? 'bg-primary' : 'bg-black/10',
              )}
            />
          ))}
        </div>

        <DialogFooter className='flex-row justify-between'>
          <Button
            className='h-10 rounded-full px-4'
            disabled={index === 0}
            variant='outline'
            onClick={handlePrev}>
            Quay lại
          </Button>
          <Button className='h-10 rounded-full px-4' onClick={handleNext}>
            {isLast ? 'Bắt đầu' : 'Tiếp tục'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
