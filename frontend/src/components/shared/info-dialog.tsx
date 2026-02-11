import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type InfoDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: ReactNode
  closeLabel?: string
} & Omit<ComponentPropsWithoutRef<typeof DialogContent>, 'children'>

export const InfoDialog = ({
  open,
  onOpenChange,
  title,
  description,
  closeLabel = 'Đóng',
  className,
  ...contentProps
}: InfoDialogProps) => {
  return (
    <Dialog modal={true} open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn('gap-4 sm:gap-5', className)}
        showCloseButton={false}
        {...contentProps}>
        <DialogHeader className='gap-2'>
          <DialogTitle className='text-lg font-semibold'>{title}</DialogTitle>
          <DialogDescription className='text-left text-sm leading-relaxed whitespace-pre-wrap'>
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='gap-2 sm:flex-row sm:justify-end sm:gap-3'>
          <Button className='h-10 rounded-full px-4' onClick={() => onOpenChange(false)}>
            {closeLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
