import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ImagePlusIcon,
  SparklesIcon,
  XIcon,
} from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Spinner } from '@/components/ui/spinner'
import { useCategories } from '@/hooks/api/use-categories'
import { useCreateDeed } from '@/hooks/api/use-deeds'
import { useIsMobile } from '@/hooks/use-mobile'

import { Textarea } from '../ui/textarea'
import { GoodDeedCategoryButton } from './good-deed-category-button'

export interface CheckInDrawerHandle {
  open: (categoryCode?: string) => void
  close: () => void
}

const moodOptions = ['An vui', 'Biết ơn', 'Nhẹ lòng', 'Ấm áp', 'Bình an', 'Hy vọng']

export const CheckInDrawer = React.forwardRef<CheckInDrawerHandle>((_props, ref) => {
  const isMobile = useIsMobile()
  const { data: categories } = useCategories()
  const createDeed = useCreateDeed()
  const [isOpen, setIsOpen] = React.useState(false)
  const [step, setStep] = React.useState(1)
  const [category, setCategory] = React.useState<string | null>(null)
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [note, setNote] = React.useState('')
  const [moodTags, setMoodTags] = React.useState<string[]>([])
  const [_imageFile, setImageFile] = React.useState<File | null>(null)
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [isCompressing, setIsCompressing] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const open = React.useCallback(
    (nextCategory?: string) => {
      setCategory(nextCategory ?? null)
      if (nextCategory) setStep(2)
      else setStep(1)
      setSelectedDate(new Date())
      setNote('')
      setMoodTags([])
      setImageFile(null)
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
        setImagePreview(null)
      }
      setIsOpen(true)
    },
    [imagePreview],
  )

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

  const compressImage = React.useCallback(async (file: File) => {
    const imageUrl = URL.createObjectURL(file)
    try {
      const image = new Image()
      const imageLoaded = new Promise<HTMLImageElement>((resolve, reject) => {
        image.onload = () => resolve(image)
        image.onerror = (event) => reject(event)
      })
      image.src = imageUrl

      const img = await imageLoaded
      const maxSize = 1280
      const ratio = Math.min(1, maxSize / Math.max(img.width, img.height))
      const width = Math.round(img.width * ratio)
      const height = Math.round(img.height * ratio)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) return file

      ctx.drawImage(img, 0, 0, width, height)

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.8)
      })

      if (!blob) return file

      return new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
        type: 'image/jpeg',
        lastModified: Date.now(),
      })
    } finally {
      URL.revokeObjectURL(imageUrl)
    }
  }, [])

  const handleImageSelect = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return
      setIsCompressing(true)
      try {
        const compressed = await compressImage(file)
        setImageFile(compressed)
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview)
        }
        setImagePreview(URL.createObjectURL(compressed))
      } finally {
        setIsCompressing(false)
      }
    },
    [compressImage, imagePreview],
  )

  const handleSubmit = React.useCallback(async () => {
    if (!category) return

    const categoryCode = category
    const now = new Date()
    const performedAt = new Date(selectedDate)
    performedAt.setHours(now.getHours(), now.getMinutes(), 0, 0)

    await createDeed.mutateAsync({
      categoryCode,
      description: note.trim() || undefined,
      performedAt: performedAt.getTime(),
    })

    setIsOpen(false)
  }, [category, createDeed, note, selectedDate])

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
    <Drawer direction={isMobile ? 'bottom' : 'right'} open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <div className='mx-auto flex w-full max-w-md flex-col'>
          <DrawerHeader className='items-start gap-2'>
            <div className='flex w-full items-start justify-between gap-4'>
              <div className='flex-1 text-left'>
                <DrawerTitle className='text-foreground text-lg font-semibold'>
                  Ghi lại một việc thiện
                </DrawerTitle>
                <p className='text-muted-foreground mt-1 text-sm'>
                  {step === 1 && 'Bạn muốn ghi nhận việc thiện nào?'}
                  {step === 2 && 'Thêm một hình ảnh nếu bạn muốn.'}
                  {step === 3 && 'Một dòng nhỏ để lưu lại khoảnh khắc này.'}
                  {step === 4 && 'Chọn cảm xúc đang có hôm nay.'}
                </p>
              </div>
              <DrawerClose asChild>
                <Button
                  aria-label='Đóng'
                  className='h-9 w-9 self-start rounded-full bg-gray-200'
                  size='icon'
                  variant='ghost'>
                  <XIcon className='h-4 w-4' />
                </Button>
              </DrawerClose>
            </div>
            {/* <p className='text-muted-foreground text-xs'>Bước {step} / 4</p> */}
          </DrawerHeader>

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
              </div>
            )}

            {step === 4 && (
              <div className='flex flex-col gap-4'>
                <div className='text-muted-foreground flex min-h-36 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-black/10 bg-white/80 text-center text-sm'>
                  {imagePreview ? (
                    <img
                      alt='Ảnh đã chọn'
                      className='h-36 w-full rounded-2xl object-cover'
                      src={imagePreview}
                    />
                  ) : (
                    <span>Chưa có hình ảnh</span>
                  )}
                  <input
                    ref={fileInputRef}
                    accept='image/*'
                    className='hidden'
                    type='file'
                    onChange={handleImageSelect}
                  />
                  <Button
                    className='h-9 rounded-full px-4 text-sm'
                    disabled={isCompressing}
                    variant='secondary'
                    onClick={() => fileInputRef.current?.click()}>
                    {isCompressing ? <Spinner /> : <ImagePlusIcon className='h-4 w-4' />}
                    {imagePreview ? 'Đổi ảnh' : 'Tải ảnh lên'}
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className='flex flex-col gap-4'>
                <div className='flex flex-wrap gap-2'>
                  {moodOptions.map((tag) => (
                    <button
                      key={tag}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        moodTags.includes(tag)
                          ? 'border-primary/40 bg-primary/15 text-primary'
                          : 'text-foreground border-black/5 bg-white/80'
                      }`}
                      type='button'
                      onClick={() => toggleMoodTag(tag)}>
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DrawerFooter className='gap-3'>
            <div className='flex items-center justify-center gap-2'>
              {[1, 2, 3, 4].map((item) => (
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
                {step < 4 ? (
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
          </DrawerFooter>

          <div className='px-4 pb-4'>
            <div className='flex items-center gap-3 rounded-2xl border border-black/5 bg-white/80 p-4'>
              <div className='bg-secondary/40 flex h-10 w-10 items-center justify-center rounded-full'>
                <SparklesIcon className='text-primary h-5 w-5' />
              </div>
              <div>
                <p className='text-foreground text-sm font-medium'>Gieo một hạt giống lành</p>
                <p className='text-muted-foreground text-xs'>
                  Bước nhỏ hôm nay sẽ tạo nên thay đổi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
})
