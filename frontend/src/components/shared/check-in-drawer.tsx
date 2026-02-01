import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from 'lucide-react'
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

export type CheckInCategory = 'body' | 'speech' | 'mind'

export interface CheckInDrawerHandle {
  open: (category?: CheckInCategory) => void
  close: () => void
}

const moodOptions = ['An vui', 'Biết ơn', 'Nhẹ lòng', 'Ấm áp', 'Bình an', 'Hy vọng']

const categoryOptions: Array<{
  key: CheckInCategory
  label: string
  icon: string
  bg: string
}> = [
  { key: 'body', label: 'Thân', icon: '/icons/icon_than.png', bg: 'bg-body/25' },
  { key: 'speech', label: 'Khẩu', icon: '/icons/icon_khau.png', bg: 'bg-speech/25' },
  { key: 'mind', label: 'Ý', icon: '/icons/icon_y.png', bg: 'bg-mind/25' },
]

const CheckInDrawer = React.forwardRef<CheckInDrawerHandle>((_props, ref) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [step, setStep] = React.useState(1)
  const [category, setCategory] = React.useState<CheckInCategory | null>(null)
  const [note, setNote] = React.useState('')
  const [isPrivate, setIsPrivate] = React.useState(true)
  const [moodTags, setMoodTags] = React.useState<string[]>([])

  const open = React.useCallback((nextCategory?: CheckInCategory) => {
    setCategory(nextCategory ?? null)
    setStep(1)
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
        <div className='mx-auto flex w-full max-w-lg flex-col'>
          <DrawerHeader className='items-start'>
            <div className='flex w-full items-center justify-between'>
              <DrawerTitle>Ghi nhận việc thiện</DrawerTitle>
              <DrawerClose asChild>
                <Button className='h-9 w-9 rounded-full' size='icon' variant='ghost'>
                  <span className='text-xs'>Đóng</span>
                </Button>
              </DrawerClose>
            </div>
            <p className='text-muted-foreground text-sm'>Bước {step} / 4</p>
          </DrawerHeader>

          <div className='px-4 pb-4'>
            <div className='bg-muted mb-5 h-1.5 w-full rounded-full'>
              <div
                className='bg-primary h-1.5 rounded-full transition-all'
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>

            {step === 1 && (
              <div className='flex flex-col gap-4'>
                <div>
                  <h3 className='text-foreground text-base font-semibold'>Chọn loại việc thiện</h3>
                  <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
                    Chọn một nhóm phù hợp với điều bạn vừa thực hành.
                  </p>
                </div>
                <div className='grid gap-3 sm:grid-cols-3'>
                  {categoryOptions.map((item) => (
                    <button
                      key={item.key}
                      className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-black/5 px-3 py-4 text-sm font-medium transition-colors ${item.bg} ${
                        category === item.key ? 'ring-primary/40 ring-2' : ''
                      }`}
                      type='button'
                      onClick={() => setCategory(item.key)}>
                      <img alt={item.label} className='h-10 w-10' src={item.icon} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className='flex flex-col gap-4'>
                <div>
                  <h3 className='text-foreground text-base font-semibold'>Viết ghi chú ngắn</h3>
                  <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
                    Một dòng nhỏ để bạn nhớ lại khoảnh khắc này.
                  </p>
                </div>
                <textarea
                  className='border-input text-foreground focus:border-primary/40 min-h-28 w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm leading-relaxed outline-none'
                  placeholder='Ví dụ: Nhường đường cho người lớn tuổi...'
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                />
                <label className='flex items-center justify-between rounded-2xl border border-black/5 bg-white/80 px-4 py-3 text-sm'>
                  <span className='text-foreground font-medium'>Riêng tư</span>
                  <input
                    checked={isPrivate}
                    className='accent-primary h-4 w-4'
                    type='checkbox'
                    onChange={(event) => setIsPrivate(event.target.checked)}
                  />
                </label>
              </div>
            )}

            {step === 3 && (
              <div className='flex flex-col gap-4'>
                <div>
                  <h3 className='text-foreground text-base font-semibold'>
                    Thêm hình ảnh (tuỳ chọn)
                  </h3>
                  <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
                    Một hình ảnh nhỏ để lưu lại cảm xúc.
                  </p>
                </div>
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
                <div>
                  <h3 className='text-foreground text-base font-semibold'>Cảm xúc đang có</h3>
                  <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
                    Chọn một hoặc vài cảm xúc để khép lại ngày hôm nay.
                  </p>
                </div>
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

          <DrawerFooter>
            <div className='flex w-full items-center gap-2'>
              <Button
                className='h-11 w-full rounded-full'
                disabled={step === 1}
                variant='ghost'
                onClick={() => setStep((prev) => Math.max(1, prev - 1))}>
                <ChevronLeftIcon className='h-4 w-4' />
                Quay lại
              </Button>
              {step < 4 ? (
                <Button
                  className='h-11 w-full rounded-full'
                  onClick={() => setStep((prev) => Math.min(4, prev + 1))}>
                  Tiếp tục
                  <ChevronRightIcon className='h-4 w-4' />
                </Button>
              ) : (
                <Button className='h-11 w-full rounded-full'>
                  <CheckIcon className='h-4 w-4' />
                  Lưu lại
                </Button>
              )}
            </div>
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
