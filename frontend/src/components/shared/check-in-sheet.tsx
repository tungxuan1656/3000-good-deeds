import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
} from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { useCategories } from '@/hooks/api/use-categories'
import { useCreateDeed } from '@/hooks/api/use-deeds'
import { useIsMobile } from '@/hooks/use-mobile'
import { MOOD_TAGS } from '@/lib/constants'
import { INFO_COPY } from '@/lib/info-copy'

import { TagButton } from '../ui/tag'
import { Textarea } from '../ui/textarea'
import { GoodDeedCategoryButton } from './good-deed-category-button'
import { InfoButton } from './info-button'

export interface CheckInDrawerHandle {
  open: (categoryCode?: string) => void
  close: () => void
}

export const CheckInSheet = React.forwardRef<CheckInDrawerHandle>((_props, ref) => {
  const isMobile = useIsMobile()
  const { data: categories } = useCategories()
  const createDeed = useCreateDeed()
  const [isOpen, setIsOpen] = React.useState(false)
  const [step, setStep] = React.useState(1)
  const [category, setCategory] = React.useState<string | null>(null)
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [note, setNote] = React.useState('')
  const [moodTags, setMoodTags] = React.useState<string[]>([])

  const open = React.useCallback((nextCategory?: string) => {
    setCategory(nextCategory ?? null)
    if (nextCategory) setStep(2)
    else setStep(1)
    setSelectedDate(new Date())
    setNote('')
    setMoodTags([])
    setIsOpen(true)
  }, [])

  const close = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  React.useImperativeHandle(ref, () => ({ open, close }), [open, close])

  const handleContinue = React.useCallback(() => {
    if (step === 2 && note.length < 5) {
      toast.error('Vui lòng nhập ghi chú với tối thiểu 5 ký tự.')

      return
    }
    setStep((prev) => Math.min(4, prev + 1))
  }, [step, note])

  const handleSubmit = React.useCallback(async () => {
    if (!category) return

    const categoryCode = category
    const performedAt = new Date(selectedDate)
    performedAt.setHours(0, 0, 0, 0)

    await createDeed.mutateAsync({
      categoryCode,
      description: note.trim() || undefined,
      labels: moodTags.length ? moodTags.join(', ') : undefined,
      performedAt: performedAt.getTime(),
    })

    setIsOpen(false)
  }, [category, createDeed, moodTags, note, selectedDate])

  const toggleMoodTag = (tag: string) => {
    setMoodTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    )
  }

  const formattedDate = React.useMemo(() => {
    const value = format(selectedDate, "EEEE, 'ngày' dd 'tháng' MM 'năm' yyyy", { locale: vi })

    return value.charAt(0).toUpperCase() + value.slice(1)
  }, [selectedDate])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        className={isMobile ? 'rounded-t-2xl' : ''}
        side={isMobile ? 'bottom' : 'right'}>
        <SheetHeader>
          <div className='flex items-center gap-1 pr-4'>
            <SheetTitle>Ghi lại một việc thiện</SheetTitle>
            <InfoButton description={INFO_COPY.deeds.description} title={INFO_COPY.deeds.title} />
          </div>
          <SheetDescription>
            {step === 1 && 'Bạn muốn ghi nhận việc thiện nào?'}
            {step === 2 && 'Một dòng ngắn để bạn nhớ lại điều đã làm.'}
            {step === 3 && 'Chọn cảm xúc để tự nhận diện, không cần đúng hay sai.'}
          </SheetDescription>
        </SheetHeader>

        <div className='px-4 pb-4'>
          {step === 1 && (
            <div className='flex flex-col gap-3'>
              {categories.map((category) => (
                <GoodDeedCategoryButton
                  key={category.code}
                  category={category}
                  onClick={() => {
                    setCategory(category.code)
                    setStep(2)
                  }}
                />
              ))}
            </div>
          )}

          {step === 2 && (
            <div className='flex flex-col gap-4'>
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className='border-input justify-between rounded-2xl border bg-white px-4 py-2 text-sm'
                      variant='secondary'>
                      <CalendarIcon className='h-4 w-4' />
                      {formattedDate}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align='start' className='bg-white'>
                    <Calendar
                      disabled={(date) => date > new Date()}
                      mode='single'
                      selected={selectedDate}
                      onSelect={(date: Date | undefined) => {
                        if (date) setSelectedDate(date)
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Textarea
                className='min-h-28 w-full resize-none rounded-2xl bg-white px-4 py-3 text-sm leading-relaxed'
                placeholder='Ví dụ: Nhường đường cho người lớn tuổi...'
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
              <p className='text-muted-foreground text-sm'>Ghi nhận này chỉ mình bạn thấy.</p>
            </div>
          )}

          {step === 3 && (
            <div className='flex flex-col gap-4'>
              <div className='flex flex-wrap gap-2'>
                {MOOD_TAGS.map((tag) => (
                  <TagButton
                    key={tag}
                    isActive={moodTags.includes(tag)}
                    label={tag}
                    onToggle={() => toggleMoodTag(tag)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <SheetFooter className='gap-3'>
          <div className='flex items-center justify-center gap-2'>
            {[1, 2, 3].map((item) => (
              <span
                key={item}
                className={`h-2 w-2 rounded-full ${item === step ? 'bg-primary' : 'bg-black/10'}`}
              />
            ))}
          </div>
          {step > 1 && (
            <div className='flex w-full items-center justify-between'>
              <Button
                className='h-9 rounded-full px-4 text-sm'
                variant='ghost'
                onClick={() => setStep((prev) => Math.max(1, prev - 1))}>
                <ChevronLeftIcon className='h-4 w-4' />
                Quay lại
              </Button>
              {step < 3 ? (
                <Button className='h-11 rounded-full px-6' onClick={handleContinue}>
                  Tiếp tục
                  <ChevronRightIcon className='h-4 w-4' />
                </Button>
              ) : (
                <Button
                  className='h-11 rounded-full px-6'
                  disabled={createDeed.isPending}
                  onClick={handleSubmit}>
                  {createDeed.isPending ? <Spinner /> : <CheckIcon className='h-4 w-4' />}
                  {createDeed.isPending ? 'Đang lưu...' : 'Lưu lại'}
                </Button>
              )}
            </div>
          )}
        </SheetFooter>

        <div className='px-4 pb-4'>
          <div className='flex items-center gap-3 rounded-2xl border border-black/5 bg-white/80 p-4'>
            <div className='bg-secondary/40 flex h-10 w-10 items-center justify-center rounded-full'>
              <SparklesIcon className='text-primary h-5 w-5' />
            </div>
            <div>
              <p className='text-foreground text-sm font-medium'>Gieo một việc thiện</p>
              <p className='text-muted-foreground text-xs'>
                Bước nhỏ hôm nay vẫn rất đáng trân trọng.
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
})
