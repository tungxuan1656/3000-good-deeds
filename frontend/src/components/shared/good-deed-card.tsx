import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { useRef } from 'react'
import { toast } from 'sonner'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDeleteDeed } from '@/hooks/api/use-deeds'
import { t } from '@/lib/i18n'
import { useGoodDeedStore } from '@/stores/good-deed.store'
import type { DeedDTO } from '@/types/api'

import { Card } from '../ui'
import { ConfirmDialog, type ConfirmDialogHandle } from './confirm-dialog'

export const GoodDeedCard = ({ deed }: { deed: DeedDTO }) => {
  const deleteDeed = useDeleteDeed()
  const openEditDeed = useGoodDeedStore.use.openEdit()

  const deleteRef = useRef<ConfirmDialogHandle>(null)

  const handleDelete = async () => {
    try {
      await deleteDeed.mutateAsync(deed.id)
      toast.success(t('deeds.card.messages.deleted'))
    } catch {
      toast.error(t('deeds.card.messages.deleteFailed'))
    }
  }

  return (
    <>
      <Card>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex flex-1 flex-col gap-1'>
            {deed.labels && (
              <p className='text-muted-foreground text-sm'>{deed.labels}</p>
            )}
            {deed.description && (
              <p className='text-foreground text-sm leading-relaxed'>
                {deed.description}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className='text-muted-foreground hover:text-foreground'>
              <MoreVertical className='size-6' />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='rounded-xl'>
              <DropdownMenuItem onClick={() => openEditDeed(deed)}>
                <Pencil className='mr-2 h-4 w-4' />
                {t('deeds.card.actions.edit')}
              </DropdownMenuItem>
              <DropdownMenuItem
                className='text-destructive focus:text-destructive'
                onClick={() => deleteRef.current?.open()}>
                <Trash2 className='mr-2 h-4 w-4' />
                {t('deeds.card.actions.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      <ConfirmDialog
        ref={deleteRef}
        cancelLabel={t('deeds.card.deleteDialog.cancel')}
        confirmLabel={t('deeds.card.deleteDialog.confirm')}
        description={t('deeds.card.deleteDialog.description')}
        title={t('deeds.card.deleteDialog.title')}
        variant='destructive'
        onConfirm={() => void handleDelete()}
      />
    </>
  )
}
