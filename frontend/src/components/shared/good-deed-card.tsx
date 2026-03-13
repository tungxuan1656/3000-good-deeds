import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { useRef } from 'react'
import { toast } from 'sonner'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCategories } from '@/hooks/api/use-categories'
import { useDeleteDeed } from '@/hooks/api/use-deeds'
import { t } from '@/lib/i18n'
import type { DeedDTO } from '@/types/api'

import { CardInlineSection } from './card-inline-section'
import { ConfirmDialog, type ConfirmDialogHandle } from './confirm-dialog'
import { EditDeedDialog, type EditDeedDialogHandle } from './edit-deed-dialog'

export const GoodDeedCard = ({ deed }: { deed: DeedDTO }) => {
  const { codeToCategoryMap } = useCategories()
  const deleteDeed = useDeleteDeed()
  const meta = codeToCategoryMap[deed.categoryCode]

  const editRef = useRef<EditDeedDialogHandle>(null)
  const deleteRef = useRef<ConfirmDialogHandle>(null)

  const handleDelete = async () => {
    try {
      await deleteDeed.mutateAsync(deed.id)
      toast.success(t('deeds.card.messages.deleted'))
    } catch (error) {
      console.error(error)
      toast.error(t('deeds.card.messages.deleteFailed'))
    }
  }

  return (
    <>
      <CardInlineSection>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex flex-1 items-center gap-3 sm:gap-4'>
            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${meta.style}`}>
              <img alt={meta.name} className='h-6 w-6' src={meta.icon} />
            </div>
            <div className='flex-1'>
              <p className='text-foreground text-base font-semibold'>{meta.name}</p>
              <p className='text-muted-foreground text-sm'>{deed.labels}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className='text-muted-foreground hover:text-foreground'>
              <MoreVertical className='size-6' />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='rounded-xl'>
              <DropdownMenuItem onClick={() => editRef.current?.open(deed)}>
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

        {deed.description && (
          <p className='text-foreground text-sm leading-relaxed'>{deed.description}</p>
        )}
      </CardInlineSection>

      <EditDeedDialog ref={editRef} />

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
