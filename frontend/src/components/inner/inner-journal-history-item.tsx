import { format, isToday, isYesterday } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Trash2Icon } from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'

import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { Button } from '@/components/ui/button'
import { useDeleteInnerJournalEntry } from '@/hooks/api/use-inner-journal'
import { INNER_JOURNAL_TYPE_LABELS, type InnerJournalType } from '@/lib/constants'
import type { JournalEntryDTO } from '@/types/api'

import { CardSection } from '../shared'

const FIFTEEN_MINUTES = 15 * 60 * 1000

type InnerJournalHistoryItemProps = {
  entry: JournalEntryDTO
}

export const InnerJournalHistoryItem = ({ entry }: InnerJournalHistoryItemProps) => {
  const deleteMutation = useDeleteInnerJournalEntry()
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const canDelete = React.useMemo(() => {
    return Date.now() - entry.createdAt <= FIFTEEN_MINUTES
  }, [entry.createdAt])

  const date = React.useMemo(() => new Date(entry.createdAt), [entry.createdAt])
  const dateKey = format(date, 'dd/MM/yyyy')

  let dateLabel = format(date, 'dd/MM', { locale: vi })
  if (isToday(date)) {
    dateLabel = `Hôm nay · ${dateLabel}`
  } else if (isYesterday(date)) {
    dateLabel = `Hôm qua · ${dateLabel}`
  } else {
    dateLabel = `Ngày ${dateLabel}`
  }

  const snippet = entry.content.length > 120 ? `${entry.content.slice(0, 120)}…` : entry.content
  const typeLabel = INNER_JOURNAL_TYPE_LABELS[entry.type as InnerJournalType] ?? entry.type

  const handleConfirmDelete = async () => {
    try {
      const result = await deleteMutation.mutateAsync(entry.id)

      if (!result.success) {
        const message =
          (result as any).error?.message ?? (result.error ? String(result.error) : 'Không thể xoá')
        toast.error(message)

        return
      }

      toast.success('Đã xoá')
      setDialogOpen(false)
    } catch (_e) {
      toast.error('Không thể xoá')
    }
  }

  const renderDeleteButton = () => {
    if (!canDelete) {
      return null
    }

    return (
      <div className='sm:pl-3'>
        <Button
          className='h-6 rounded-full px-4 text-xs'
          size='sm'
          variant='outline'
          onClick={() => setDialogOpen(true)}>
          <Trash2Icon className='size-3' />
          Xoá
        </Button>
        <ConfirmDialog
          cancelLabel='Để sau'
          confirmLabel='Xoá bài viết'
          confirmLoading={deleteMutation.isPending}
          description='Hành động này không thể hoàn tác. Bài viết sẽ được xoá vĩnh viễn.'
          open={dialogOpen}
          title='Xoá bài viết?'
          variant='destructive'
          onConfirm={() => void handleConfirmDelete()}
          onOpenChange={setDialogOpen}
        />
      </div>
    )
  }

  return (
    <CardSection className='gap-2'>
      <div className='flex items-center justify-between'>
        <span className='text-foreground text-lg font-semibold' title={dateKey}>
          {dateLabel} - {typeLabel}
        </span>
        {renderDeleteButton()}
      </div>
      <p className='text-muted-foreground text-sm leading-relaxed'>{snippet}</p>
    </CardSection>
  )
}
