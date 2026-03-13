import { Trash2Icon } from 'lucide-react'
import { useRef, useState } from 'react'

import { CardSection, ConfirmDialog, type ConfirmDialogHandle } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { t } from '@/lib/i18n'

interface DeleteAccountCardProps {
  onConfirm?: () => void
}

export const DeleteAccountCard = ({ onConfirm }: DeleteAccountCardProps) => {
  const [deleteText, setDeleteText] = useState('')
  const deleteDialogRef = useRef<ConfirmDialogHandle>(null)

  const handleDeleteOpenChange = (open: boolean) => {
    if (!open) setDeleteText('')
  }

  return (
    <>
      <CardSection className='border border-red-200/60 bg-red-50/60'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <p className='text-foreground text-base font-semibold'>
              {t('settings.deleteAccount.title')}
            </p>
            <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>
              {t('settings.deleteAccount.description')}
            </p>
          </div>
          <div className='flex items-center justify-center rounded-full'>
            <Trash2Icon className='h-4 w-4 text-red-600' />
          </div>
        </div>
        <Button
          className='mt-3 h-10 w-full rounded-full bg-red-500 text-white hover:bg-red-500/90'
          onClick={() => deleteDialogRef.current?.open()}>
          {t('settings.deleteAccount.action')}
        </Button>
      </CardSection>

      <ConfirmDialog
        ref={deleteDialogRef}
        cancelLabel={t('common.actions.later')}
        confirmDisabled={deleteText !== 'DELETE'}
        confirmLabel={t('settings.deleteAccount.action')}
        description={t('settings.deleteAccount.confirmDescription')}
        title={t('settings.deleteAccount.confirmTitle')}
        variant='destructive'
        onConfirm={() => {
          deleteDialogRef.current?.close()
          onConfirm?.()
        }}
        onOpenChange={handleDeleteOpenChange}>
        <Input
          className='rounded-2xl border border-black/5 bg-white px-4 py-2 text-sm'
          placeholder='DELETE'
          value={deleteText}
          onChange={(event) => setDeleteText(event.target.value)}
        />
      </ConfirmDialog>
    </>
  )
}
