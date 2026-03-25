import { format, isToday, isYesterday } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Trash2Icon } from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'

import { ConfirmDialog, type ConfirmDialogHandle } from '@/components/shared'
import { Button } from '@/components/ui/button'
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

  const date = React.useMemo(() => new Date(entry.createdAt), [entry.createdAt])
  const dateKey = format(date, 'dd/MM/yyyy')

  const dateBaseLabel = format(date, 'dd/MM', { locale: vi })
  let dateLabel = dateBaseLabel
  if (isToday(date)) {
    dateLabel = t('pages.timeline.dateLabel.today', { date: dateBaseLabel })
  } else if (isYesterday(date)) {
    dateLabel = t('pages.timeline.dateLabel.yesterday', { date: dateBaseLabel })
  } else {
    dateLabel = t('pages.timeline.dateLabel.day', { date: dateBaseLabel })
  }

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
    <Card className='gap-2'>
      <div className='flex items-center justify-between'>
        <span className='text-foreground text-lg font-semibold' title={dateKey}>
          {dateLabel} - {typeLabel}
        </span>
        {canDelete && (
          <div className='sm:pl-3'>
            <Button
              className='h-6 rounded-full px-4 text-xs'
              size='sm'
              variant='outline'
              onClick={() => dialogRef.current?.open()}>
              <Trash2Icon className='size-3' />
              {t('common.actions.delete')}
            </Button>
          </div>
        )}
      </div>
      <p className='text-muted-foreground text-sm leading-relaxed'>{snippet}</p>
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
    </Card>
  )
}
