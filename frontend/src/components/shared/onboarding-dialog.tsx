import { XIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

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
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const isProgrammaticScrollRef = useRef(false)

  const step = useMemo(() => steps[index], [index, steps])
  const isLast = index === steps.length - 1

  const scrollToIndex = useCallback(
    (targetIndex: number, behavior: ScrollBehavior = 'smooth') => {
      const slider = sliderRef.current
      if (!slider) return

      const clampedIndex = Math.max(0, Math.min(targetIndex, steps.length - 1))
      const targetLeft = clampedIndex * slider.clientWidth

      isProgrammaticScrollRef.current = true
      slider.scrollTo({ left: targetLeft, behavior })

      window.setTimeout(() => {
        isProgrammaticScrollRef.current = false
      }, 300)
    },
    [steps.length],
  )

  useEffect(() => {
    if (!open) return

    setIndex(0)
    scrollToIndex(0, 'auto')
  }, [open, scrollToIndex])

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setIndex(0)
      onOpenChange(false)

      return
    }

    onOpenChange(true)
  }

  const handleClose = () => {
    setIndex(0)
    onOpenChange(false)
  }

  const handleNext = () => {
    if (isLast) {
      handleClose()

      return
    }

    setIndex((prev) => {
      const nextIndex = Math.min(prev + 1, steps.length - 1)
      scrollToIndex(nextIndex)

      return nextIndex
    })
  }

  const handlePrev = () => {
    setIndex((prev) => {
      const prevIndex = Math.max(prev - 1, 0)
      scrollToIndex(prevIndex)

      return prevIndex
    })
  }

  const handleSliderScroll = () => {
    if (isProgrammaticScrollRef.current) return

    const slider = sliderRef.current
    if (!slider || slider.clientWidth === 0) return

    const nextIndex = Math.round(slider.scrollLeft / slider.clientWidth)
    if (nextIndex !== index) {
      setIndex(Math.max(0, Math.min(nextIndex, steps.length - 1)))
    }
  }

  if (!step) return null

  return (
    <Dialog modal={true} open={open} onOpenChange={handleOpenChange}>
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
          <div
            ref={sliderRef}
            className='flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-3xl [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
            onScroll={handleSliderScroll}>
            {steps.map((item, imageIndex) => (
              <div key={`${item.title}-${imageIndex}`} className='w-full shrink-0 snap-start'>
                <img
                  alt={item.title}
                  className='h-80 max-h-80 w-full object-cover'
                  src={item.image}
                />
              </div>
            ))}
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
