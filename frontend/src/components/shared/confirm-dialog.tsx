import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'

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

export type ConfirmDialogHandle = {
  open: () => void
  close: () => void
}

type ConfirmDialogProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'destructive'
  confirmDisabled?: boolean
  confirmLoading?: boolean
  onConfirm?: () => void
  onCancel?: () => void
  children?: ReactNode
} & Omit<ComponentPropsWithoutRef<typeof DialogContent>, 'children'>

export const ConfirmDialog = forwardRef<ConfirmDialogHandle, ConfirmDialogProps>(
  (
    {
      open,
      defaultOpen = false,
      onOpenChange,
      title,
      description,
      confirmLabel = 'Xác nhận',
      cancelLabel,
      variant = 'default',
      confirmDisabled,
      confirmLoading,
      onConfirm,
      onCancel,
      children,
      className,
      ...contentProps
    },
    ref,
  ) => {
    const isControlled = open !== undefined
    const [internalOpen, setInternalOpen] = useState(defaultOpen)

    const dialogOpen = isControlled ? open : internalOpen

    const setOpen = useCallback(
      (next: boolean) => {
        if (!isControlled) setInternalOpen(next)
        onOpenChange?.(next)
      },
      [isControlled, onOpenChange],
    )

    useImperativeHandle(
      ref,
      () => ({
        open: () => setOpen(true),
        close: () => setOpen(false),
      }),
      [setOpen],
    )

    const handleCancel = () => {
      onCancel?.()
      setOpen(false)
    }

    const handleConfirm = () => {
      onConfirm?.()
    }

    return (
      <Dialog modal={true} open={dialogOpen} onOpenChange={setOpen}>
        <DialogContent
          className={cn('gap-4 sm:gap-5', className)}
          showCloseButton={false}
          {...contentProps}>
          <DialogHeader className='gap-2'>
            <DialogTitle className='text-[17px] font-semibold'>{title}</DialogTitle>
            {description ? (
              <DialogDescription className='text-sm leading-relaxed'>
                {description}
              </DialogDescription>
            ) : null}
          </DialogHeader>

          {children}

          <DialogFooter className='gap-2 sm:flex-row sm:justify-end sm:gap-3'>
            <Button
              className='h-10 rounded-full px-4'
              disabled={confirmDisabled || confirmLoading}
              variant={variant === 'destructive' ? 'destructive' : 'default'}
              onClick={handleConfirm}>
              {confirmLoading ? 'Đang xử lý...' : confirmLabel}
            </Button>
            {cancelLabel ? (
              <Button className='h-10 rounded-full px-4' variant='outline' onClick={handleCancel}>
                {cancelLabel}
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
)

ConfirmDialog.displayName = 'ConfirmDialog'
