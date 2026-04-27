import { useRef, useState } from 'react'

import {
  ConfirmDialog,
  type ConfirmDialogHandle,
} from '@/components/shared/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { t } from '@/lib/i18n'

import { Card } from '../ui'

interface DeleteAccountCardProps {
  onConfirm?: () => void | Promise<void>
}

export const DeleteAccountCard = ({ onConfirm }: DeleteAccountCardProps) => {
  const [deleteText, setDeleteText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const deleteDialogRef = useRef<ConfirmDialogHandle>(null)
  const deleteKeyword = t('settings.deleteAccount.keyword')

  const handleConfirm = async () => {
    if (isDeleting) {
      return
    }

    try {
      setIsDeleting(true)
      await onConfirm?.()
      setDeleteText('')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card className='border-destructive/30 bg-destructive/10 border'>
        <h4 className='text-foreground text-base font-semibold md:text-xl'>
          {t('settings.deleteAccount.title')}
        </h4>
        <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>
          {t('settings.deleteAccount.description')}
        </p>
        <div className='flex w-full justify-end'>
          <Button
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90 mt-3 h-9'
            disabled={isDeleting}
            onClick={() => {
              setDeleteText('')
              deleteDialogRef.current?.open()
            }}>
            {t('settings.deleteAccount.action')}
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        ref={deleteDialogRef}
        cancelLabel={t('common.actions.later')}
        confirmDisabled={isDeleting || deleteText !== deleteKeyword}
        confirmLabel={t('settings.deleteAccount.action')}
        confirmLoading={isDeleting}
        description={t('settings.deleteAccount.confirmDescription')}
        title={t('settings.deleteAccount.confirmTitle')}
        variant='destructive'
        onCancel={() => {
          if (isDeleting) {
            return
          }
          setDeleteText('')
        }}
        onConfirm={handleConfirm}>
        <Input
          className='border-input bg-card rounded-2xl border px-4 py-2 text-sm'
          disabled={isDeleting}
          placeholder={deleteKeyword}
          value={deleteText}
          onChange={(event) => setDeleteText(event.target.value)}
        />
      </ConfirmDialog>
    </>
  )
}
