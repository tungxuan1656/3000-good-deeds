import { LeafIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'

import { ConfirmDialog, type ConfirmDialogHandle } from '@/components/shared'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDeleteInnerJournalEntry } from '@/hooks/api/use-inner-journal'
import { type InnerJournalType } from '@/lib/constants'
import { t } from '@/lib/i18n'
import type { JournalEntryDTO } from '@/types/api'

import { Card } from '../ui'

const FIFTEEN_MINUTES = 15 * 60 * 1000

type InnerJournalHistoryItemProps = {
  entry: JournalEntryDTO
}

export const InnerJournalHistoryItem = ({
  entry,
}: InnerJournalHistoryItemProps) => {
  const deleteMutation = useDeleteInnerJournalEntry()
  const dialogRef = React.useRef<ConfirmDialogHandle>(null)

  const canDelete = React.useMemo(() => {
    return Date.now() - entry.createdAt <= FIFTEEN_MINUTES
  }, [entry.createdAt])

  const snippet =
    entry.content.length > 120
      ? entry.content.slice(0, 120) + '…'
      : entry.content
  const type = entry.type as InnerJournalType
  const typeLabel = t(`journal.types.${type}.label`)

  const handleConfirmDelete = async () => {
    try {
      const result = await deleteMutation.mutateAsync(entry.id)

      if (!result.success) {
        const message =
          (result as any).error?.message ??
          (result.error
            ? String(result.error)
            : t('common.errors.deleteFailed'))
        toast.error(message)

        return
      }

      toast.success(t('common.success.deleted'))
    } catch (_e) {
      toast.error(t('common.errors.deleteFailed'))
    }
  }

  return (
    <>
      <Card padding='sm'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex flex-row items-center gap-3'>
            <div className='bg-primary/25 flex size-8 items-center justify-center rounded-full'>
              <LeafIcon className='fill-primary/50 text-primary' size={16} />
            </div>
            <div className='flex flex-1 flex-col gap-1'>
              <p className='text-muted-foreground text-sm font-light tracking-wide'>
                {typeLabel}
              </p>
              <p className='text-foreground tracking-xs leading-relaxed'>
                {snippet}
              </p>
            </div>
          </div>

          {canDelete ? (
            <DropdownMenu>
              <DropdownMenuTrigger className='text-muted-foreground hover:text-foreground'>
                <MoreHorizontalIcon className='size-4 md:size-5' />
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='rounded-xl'>
                <DropdownMenuItem
                  className='text-destructive focus:text-destructive'
                  onClick={() => dialogRef.current?.open()}>
                  <Trash2Icon className='mr-2 h-4 w-4' />
                  {t('common.actions.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span className='text-muted-foreground/40 inline-flex h-5 w-5 items-center justify-center'>
              <MoreHorizontalIcon className='size-4' />
            </span>
          )}
        </div>
      </Card>

      <ConfirmDialog
        ref={dialogRef}
        cancelLabel={t('common.actions.later')}
        confirmLabel={t('common.actions.deletePost')}
        confirmLoading={deleteMutation.isPending}
        description={t('journal.page.deleteDescription')}
        title={t('journal.page.deleteTitle')}
        variant='destructive'
        onConfirm={() => void handleConfirmDelete()}
      />
    </>
  )
}
