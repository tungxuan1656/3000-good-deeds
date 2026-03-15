import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateDeed } from '@/hooks/api/use-deeds'
import { MOOD_TAGS } from '@/lib/constants'
import { t } from '@/lib/i18n'
import type { DeedDTO } from '@/types/api'

import { TagButton } from '../ui/tag'

export type EditDeedDialogHandle = {
  open: (deed: DeedDTO) => void
}

export const EditDeedDialog = React.forwardRef<EditDeedDialogHandle>((_props, ref) => {
  const updateDeed = useUpdateDeed()

  const [isOpen, setIsOpen] = React.useState(false)
  const [deed, setDeed] = React.useState<DeedDTO | null>(null)
  const [description, setDescription] = React.useState('')
  const [moodTags, setMoodTags] = React.useState<string[]>([])
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())

  React.useImperativeHandle(
    ref,
    () => ({
      open: (d: DeedDTO) => {
        setDeed(d)
        setDescription(d.description || '')
        setMoodTags(d.labels ? d.labels.split(',').map((label) => label.trim()) : [])
        setSelectedDate(new Date(d.performedAt || d.createdAt))
        setIsOpen(true)
      },
    }),
    [],
  )

  const toggleMoodTag = (tag: string) => {
    setMoodTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    )
  }

  const activeMoodTagSet = React.useMemo(() => new Set(moodTags), [moodTags])

  const handleSubmit = async () => {
    if (!deed) return

    try {
      const performedAt = new Date(selectedDate)
      performedAt.setHours(0, 0, 0, 0)

      const trimmedDescription = description.trim()

      await updateDeed.mutateAsync({
        id: deed.id,
        data: {
          description: trimmedDescription.length > 0 ? trimmedDescription : undefined,
          labels: moodTags.length ? moodTags.join(', ') : undefined,
          performedAt: performedAt.getTime(),
        },
      })

      toast.success(t('deeds.edit.messages.updated'))
      setIsOpen(false)
    } catch {
      toast.error(t('deeds.edit.messages.updateFailed'))
    }
  }

  const formattedDate = React.useMemo(() => {
    const value = format(selectedDate, t('dates.formats.fullDate'), { locale: vi })

    return value.charAt(0).toUpperCase() + value.slice(1)
  }, [selectedDate])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('deeds.edit.title')}</DialogTitle>
          <DialogDescription>{t('deeds.edit.description')}</DialogDescription>
        </DialogHeader>

        <p className='text-muted-foreground text-sm'>{t('deeds.edit.privateNote')}</p>

        <div className='flex flex-col gap-4 py-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='date'>{t('deeds.edit.fields.date')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className='border-input bg-card justify-between self-start rounded-2xl border-2 px-4 py-2 text-sm'
                  id='date'
                  variant='secondary'>
                  <CalendarIcon className='h-4 w-4' />
                  {formattedDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent align='start' className='bg-card w-auto p-0'>
                <Calendar
                  disabled={(date) => date > new Date()}
                  mode='single'
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='description'>{t('deeds.edit.fields.note')}</Label>
            <Textarea
              className='min-h-25 rounded-2xl border-2'
              id='description'
              placeholder={t('deeds.edit.fields.notePlaceholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className='text-muted-foreground text-sm'>{t('deeds.edit.fields.noteHint')}</p>
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='labels'>{t('deeds.edit.fields.moodTags')}</Label>
            <div className='flex flex-wrap gap-2'>
              {MOOD_TAGS.map((tag) => (
                <TagButton
                  key={tag}
                  isActive={activeMoodTagSet.has(tag)}
                  label={tag}
                  onToggle={() => toggleMoodTag(tag)}
                />
              ))}
            </div>
            <p className='text-muted-foreground text-sm'>{t('deeds.edit.fields.moodTagsHint')}</p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>{t('common.actions.cancel')}</Button>
          </DialogClose>
          <Button disabled={updateDeed.isPending} onClick={() => void handleSubmit()}>
            {updateDeed.isPending ? t('common.actions.saving') : t('deeds.edit.saveChanges')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

EditDeedDialog.displayName = 'EditDeedDialog'
