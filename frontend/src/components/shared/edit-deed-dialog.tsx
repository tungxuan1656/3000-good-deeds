import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { useCategories } from '@/hooks/api/use-categories'
import { useUpdateDeed } from '@/hooks/api/use-deeds'
import { MOOD_TAGS } from '@/lib/constants'
import type { DeedDTO } from '@/types/api'

import { TagButton } from '../ui/tag'
import { GoodDeedCategoryMiniButton } from './good-deed-category-button'

interface EditDeedDialogProps {
  deed: DeedDTO | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const EditDeedDialog = ({ deed, open, onOpenChange }: EditDeedDialogProps) => {
  const { data: categories } = useCategories()
  const updateDeed = useUpdateDeed()

  const [categoryCode, setCategoryCode] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [moodTags, setMoodTags] = React.useState<string[]>([])
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())

  const toggleMoodTag = (tag: string) => {
    setMoodTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    )
  }

  React.useEffect(() => {
    if (deed) {
      setCategoryCode(deed.categoryCode)
      setDescription(deed.description || '')
      setMoodTags(deed.labels ? deed.labels.split(',').map((label) => label.trim()) : [])
      setSelectedDate(new Date(deed.performedAt || deed.createdAt))
    }
  }, [deed])

  const handleSubmit = async () => {
    if (!deed) return

    try {
      const performedAt = new Date(selectedDate)
      performedAt.setHours(0, 0, 0, 0)

      await updateDeed.mutateAsync({
        id: deed.id,
        data: {
          categoryCode,
          description: description.trim() || undefined,
          labels: moodTags.length ? moodTags.join(', ') : undefined,
          performedAt: performedAt.getTime(),
        },
      })

      toast.success('Đã cập nhật việc thiện')
      onOpenChange(false)
    } catch (error) {
      console.error(error)
      toast.error('Không thể cập nhật việc thiện')
    }
  }

  const formattedDate = React.useMemo(() => {
    const value = format(selectedDate, "EEEE, 'ngày' dd 'tháng' MM 'năm' yyyy", { locale: vi })

    return value.charAt(0).toUpperCase() + value.slice(1)
  }, [selectedDate])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa việc thiện</DialogTitle>
          <DialogDescription>Cập nhật thông tin việc thiện của bạn.</DialogDescription>
        </DialogHeader>

        <p className='text-muted-foreground text-sm'>Ghi nhận này chỉ mình bạn thấy.</p>

        <div className='flex flex-col gap-4 py-4'>
          <div className='flex gap-2'>
            {categories.map((cat) => (
              <GoodDeedCategoryMiniButton
                key={cat.code}
                category={cat}
                isActive={categoryCode === cat.code}
                onClick={() => setCategoryCode(cat.code)}
              />
            ))}
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='date'>Ngày thực hiện</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className='border-input justify-between self-start rounded-2xl border-2 bg-white px-4 py-2 text-sm'
                  id='date'
                  variant='secondary'>
                  <CalendarIcon className='h-4 w-4' />
                  {formattedDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent align='start' className='w-auto bg-white p-0'>
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
            <Label htmlFor='description'>Ghi chú</Label>
            <Textarea
              className='min-h-25 rounded-2xl border-2'
              id='description'
              placeholder='Viết ghi chú về việc thiện này...'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className='text-muted-foreground text-sm'>Có thể để trống nếu bạn muốn.</p>
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='labels'>Nhãn cảm xúc</Label>
            <div className='flex flex-wrap gap-2'>
              {MOOD_TAGS.map((tag) => {
                return (
                  <TagButton
                    key={tag}
                    isActive={moodTags.includes(tag)}
                    label={tag}
                    onToggle={() => toggleMoodTag(tag)}
                  />
                )
              })}
            </div>
            <p className='text-muted-foreground text-sm'>
              Nhãn chỉ để tự nhận diện, không cần đúng hay sai.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button disabled={updateDeed.isPending} onClick={() => void handleSubmit()}>
            {updateDeed.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
