import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { forwardRef, useImperativeHandle, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export type ConfirmDialogHandle = {
  open: () => void
  close: () => void
}

type ConfirmDialogProps = {
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
      title,
      description,
      confirmLabel = t('common.actions.confirm'),
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
    const [isOpen, setIsOpen] = useState(false)

    useImperativeHandle(
      ref,
      () => ({
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }),
      [],
    )

    const handleCancel = () => {
      onCancel?.()
      setIsOpen(false)
    }

    const handleConfirm = () => {
      onConfirm?.()
      if (!confirmLoading) setIsOpen(false)
    }

    return (
      <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
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
              {confirmLoading ? t('common.actions.processing') : confirmLabel}
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
