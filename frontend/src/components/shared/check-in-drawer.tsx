import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, SparklesIcon, XIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

import { Textarea } from '../ui/textarea'
import { GoodDeedCategoryButton } from './good-deed-category-button'

export type CheckInCategory = 'body' | 'speech' | 'mind'

export interface CheckInDrawerHandle {
  open: (category?: CheckInCategory) => void
  close: () => void
}

const moodOptions = ['An vui', 'Biết ơn', 'Nhẹ lòng', 'Ấm áp', 'Bình an', 'Hy vọng']

const categoryOptions: Array<{
  key: CheckInCategory
  label: string
  description: string
  icon: string
  bg: string
}> = [
  {
    key: 'body',
    label: 'Thân',
    description: 'Hỗ trợ, giúp đỡ, hành động thiện lành',
    icon: '/icons/icon_than.png',
    bg: 'bg-body/20',
  },
  {
    key: 'speech',
    label: 'Khẩu',
    description: 'Lời nói hiền lành & nâng đỡ người khác',
    icon: '/icons/icon_khau.png',
    bg: 'bg-speech/20',
  },
  {
    key: 'mind',
    label: 'Ý',
    description: 'Suy nghĩ tốt đẹp & thiện lành',
    icon: '/icons/icon_y.png',
    bg: 'bg-mind/20',
  },
]

const CheckInDrawer = React.forwardRef<CheckInDrawerHandle>((_props, ref) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [step, setStep] = React.useState(1)
  const [_category, setCategory] = React.useState<CheckInCategory | null>(null)
  const [note, setNote] = React.useState('')
  const [moodTags, setMoodTags] = React.useState<string[]>([])

  const open = React.useCallback((nextCategory?: CheckInCategory) => {
    setCategory(nextCategory ?? null)
    if (nextCategory) setStep(2)
    else setStep(1)
    setNote('')
    setMoodTags([])
    setIsOpen(true)
  }, [])

  const close = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  React.useImperativeHandle(ref, () => ({ open, close }), [open, close])

  const toggleMoodTag = (tag: string) => {
    setMoodTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
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
                  {step === 2 && 'Một dòng nhỏ để lưu lại khoảnh khắc này.'}
                  {step === 3 && 'Thêm một hình ảnh nếu bạn muốn.'}
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
                {categoryOptions.map((item) => (
                  <GoodDeedCategoryButton
                    key={item.key}
                    variant={item.key}
                    onClick={() => {
                      setCategory(item.key)
                      setStep(2)
                    }}
                  />
                ))}
              </div>
            )}

            {step === 2 && (
              <div className='flex flex-col gap-4'>
                <Textarea
                  className='min-h-28 w-full resize-none rounded-2xl bg-white px-4 py-3 text-sm leading-relaxed'
                  placeholder='Ví dụ: Nhường đường cho người lớn tuổi...'
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                />
              </div>
            )}

            {step === 3 && (
              <div className='flex flex-col gap-4'>
                <div className='text-muted-foreground flex min-h-36 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-black/10 bg-white/80 text-center text-sm'>
                  <span>Chưa có hình ảnh</span>
                  <Button className='h-9 rounded-full px-4 text-sm' variant='secondary'>
                    Tải ảnh lên
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
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
                  <Button
                    className='h-11 rounded-full px-6'
                    onClick={() => setStep((prev) => Math.min(4, prev + 1))}>
                    Tiếp tục
                    <ChevronRightIcon className='h-4 w-4' />
                  </Button>
                ) : (
                  <Button className='h-11 rounded-full px-6'>
                    <CheckIcon className='h-4 w-4' />
                    Lưu lại
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

CheckInDrawer.displayName = 'CheckInDrawer'

export default CheckInDrawer
