import { XIcon } from 'lucide-react'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export type OnboardingStep = {
  image: string
  title: string
  description: string
}

export type OnboardingDialogHandle = {
  open: () => void
  close: () => void
}

type OnboardingDialogProps = {
  flowTitle: string
  steps: OnboardingStep[]
  className?: string
  onClose?: () => void
}

export const OnboardingDialog = forwardRef<OnboardingDialogHandle, OnboardingDialogProps>(
  ({ flowTitle, steps, className, onClose }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [index, setIndex] = useState(0)
    const sliderRef = useRef<HTMLDivElement | null>(null)
    const isProgrammaticScrollRef = useRef(false)

    const step = useMemo(() => steps[index], [index, steps])
    const maxIndex = Math.max(0, steps.length - 1)
    const isLast = index >= maxIndex

    useImperativeHandle(
      ref,
      () => ({
        open: () => setIsOpen(true),
        close: () => {
          setIndex(0)
          setIsOpen(false)
          onClose?.()
        },
      }),
      [onClose],
    )

    const scrollToIndex = useCallback(
      (targetIndex: number, behavior: ScrollBehavior = 'smooth') => {
        const slider = sliderRef.current
        if (!slider) return

        const clampedIndex = Math.max(0, Math.min(targetIndex, maxIndex))
        const targetLeft = clampedIndex * slider.clientWidth

        isProgrammaticScrollRef.current = true
        slider.scrollTo({ left: targetLeft, behavior })

        window.setTimeout(() => {
          isProgrammaticScrollRef.current = false
        }, 300)
      },
      [maxIndex],
    )

    useEffect(() => {
      if (!isOpen) return

      setIndex(0)
      scrollToIndex(0, 'auto')
    }, [isOpen, scrollToIndex])

    const handleClose = () => {
      setIndex(0)
      setIsOpen(false)
      onClose?.()
    }

    const handleNext = () => {
      if (steps.length === 0) {
        handleClose()

        return
      }

      if (isLast) {
        handleClose()

        return
      }

      setIndex((prev) => {
        const nextIndex = Math.min(prev + 1, maxIndex)
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
        setIndex(Math.max(0, Math.min(nextIndex, maxIndex)))
      }
    }

    return (
      <Dialog
        modal={true}
        open={isOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            handleClose()

            return
          }
          setIsOpen(true)
        }}>
        <DialogContent className={cn('gap-4 sm:gap-5', className)} showCloseButton={false}>
          <DialogHeader className='gap-1'>
            <p className='text-muted-foreground text-xs font-medium tracking-widest uppercase'>
              {flowTitle}
            </p>
            <DialogTitle className='text-base font-semibold'>
              {step?.title ?? ''}
            </DialogTitle>
            <DialogClose asChild>
              <button
                className='absolute top-4 right-4 rounded-full bg-gray-200 p-1'
                type='button'
                onClick={handleClose}>
                <XIcon className='text-muted-foreground/60 size-4' />
              </button>
            </DialogClose>
          </DialogHeader>

          {step && (
            <>
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
            </>
          )}

          <DialogFooter className='flex-row justify-between'>
            <Button
              className='h-10 rounded-full px-4'
              disabled={index === 0}
              variant='outline'
              onClick={handlePrev}>
              {t('onboarding.dialog.back')}
            </Button>
            <Button className='h-10 rounded-full px-4' onClick={handleNext}>
              {isLast ? t('onboarding.dialog.start') : t('onboarding.dialog.continue')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
)

OnboardingDialog.displayName = 'OnboardingDialog'
