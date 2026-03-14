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
  const deleteKeyword = t('settings.deleteAccount.keyword')

  return (
    <>
      <CardSection className='border-destructive/30 bg-destructive/10 border'>
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
            <Trash2Icon className='text-destructive h-4 w-4' />
          </div>
        </div>
        <Button
          className='bg-destructive text-destructive-foreground hover:bg-destructive/90 mt-3 h-10 w-full rounded-full'
          onClick={() => {
            setDeleteText('')
            deleteDialogRef.current?.open()
          }}>
          {t('settings.deleteAccount.action')}
        </Button>
      </CardSection>

      <ConfirmDialog
        ref={deleteDialogRef}
        cancelLabel={t('common.actions.later')}
        confirmDisabled={deleteText !== deleteKeyword}
        confirmLabel={t('settings.deleteAccount.action')}
        description={t('settings.deleteAccount.confirmDescription')}
        title={t('settings.deleteAccount.confirmTitle')}
        variant='destructive'
        onCancel={() => setDeleteText('')}
        onConfirm={() => {
          setDeleteText('')
          onConfirm?.()
        }}>
        <Input
          className='border-input bg-card rounded-2xl border px-4 py-2 text-sm'
          placeholder={deleteKeyword}
          value={deleteText}
          onChange={(event) => setDeleteText(event.target.value)}
        />
      </ConfirmDialog>
    </>
  )
}
