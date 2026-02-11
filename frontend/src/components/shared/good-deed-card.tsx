import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCategories } from '@/hooks/api/use-categories'
import { useDeleteDeed } from '@/hooks/api/use-deeds'
import type { DeedDTO } from '@/types/api'

import { CardInlineSection } from './card-inline-section'
import { ConfirmDialog } from './confirm-dialog'
import { EditDeedDialog } from './edit-deed-dialog'

export const GoodDeedCard = ({ deed }: { deed: DeedDTO }) => {
  const { codeToCategoryMap } = useCategories()
  const deleteDeed = useDeleteDeed()
  const meta = codeToCategoryMap[deed.categoryCode]

  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteDeed.mutateAsync(deed.id)
      toast.success('Đã xoá việc thiện')
    } catch (error) {
      console.error(error)
      toast.error('Không thể xoá việc thiện')
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
              <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                <Pencil className='mr-2 h-4 w-4' />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                className='text-destructive focus:text-destructive'
                onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className='mr-2 h-4 w-4' />
                Xoá
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {deed.description && (
          <p className='text-foreground text-sm leading-relaxed'>{deed.description}</p>
        )}
      </CardInlineSection>

      <EditDeedDialog deed={deed} open={showEditDialog} onOpenChange={setShowEditDialog} />

      <ConfirmDialog
        cancelLabel='Giữ lại'
        confirmLabel='Xoá việc này'
        description='Nếu xoá, bạn sẽ không xem lại được ghi nhận này nữa.'
        open={showDeleteDialog}
        title='Xoá ghi nhận này?'
        variant='destructive'
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={() => void handleDelete()}
      />
    </>
  )
}
