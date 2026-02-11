import { CheckIcon, ClockIcon, Edit3Icon, ImageIcon, LockIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'

import { CardSection, HeaderSection } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const DeedDetailPage = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [note, setNote] = useState('Nhường đường cho người lớn tuổi ở ngã tư buổi sáng.')

  return (
    <div className='mx-auto flex w-full max-w-3xl flex-col gap-4'>
      <HeaderSection
        description='Xem lại, chỉnh sửa hoặc ghi nhận cảm xúc trong việc thiện này.'
        note='Ghi nhận này chỉ mình bạn thấy.'
        subtitle='Chi tiết'
        title='Chi tiết việc thiện'
      />

      <CardSection className='gap-4'>
        <div className='flex flex-wrap items-center gap-3'>
          <div className='bg-body/20 flex items-center gap-3 rounded-2xl border border-black/5 px-3 py-2'>
            <img alt='Thân' className='h-6 w-6' src='/icons/icon_than.png' />
            <span className='text-foreground text-sm font-semibold'>Thân</span>
          </div>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <ClockIcon className='h-3.5 w-3.5' />
            15/10/2026 · 08:45
          </div>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <LockIcon className='h-3.5 w-3.5' />
            Riêng tư
          </div>
        </div>

        {!isEditing && <p className='text-foreground text-base leading-relaxed'>{note}</p>}

        {isEditing && (
          <div className='flex flex-col gap-3'>
            <Textarea
              className='min-h-28 w-full resize-none rounded-2xl bg-white px-4 py-3 text-sm leading-relaxed'
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
            <p className='text-muted-foreground text-sm'>Ghi chú có thể để trống.</p>
          </div>
        )}

        <div className='flex flex-wrap gap-2'>
          {['Biết ơn', 'Nhẹ lòng'].map((tag) => (
            <span
              key={tag}
              className='text-muted-foreground rounded-full border border-black/5 bg-white px-3 py-1 text-xs'>
              {tag}
            </span>
          ))}
        </div>

        <div className='flex flex-col gap-3 rounded-2xl border border-dashed border-black/10 bg-white/60 px-4 py-5 text-center'>
          <div className='text-muted-foreground mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white'>
            <ImageIcon className='h-5 w-5' />
          </div>
          <p className='text-muted-foreground text-sm'>Chưa có hình ảnh đính kèm.</p>
        </div>
      </CardSection>

      <CardSection className='flex flex-col gap-3'>
        {!isEditing ? (
          <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
            <Button
              className='h-11 w-full rounded-full sm:w-auto'
              onClick={() => setIsEditing(true)}>
              <Edit3Icon className='h-4 w-4' />
              Chỉnh sửa
            </Button>
            <Button
              className='text-foreground h-11 w-full rounded-full border border-black/5 bg-white hover:bg-white/80 sm:w-auto'
              variant='secondary'
              onClick={() => setShowDeleteConfirm(true)}>
              <Trash2Icon className='h-4 w-4' />
              Xoá
            </Button>
          </div>
        ) : (
          <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
            <Button
              className='h-11 w-full rounded-full sm:w-auto'
              onClick={() => setIsEditing(false)}>
              <CheckIcon className='h-4 w-4' />
              Lưu thay đổi
            </Button>
            <Button
              className='text-muted-foreground hover:text-foreground h-11 w-full rounded-full sm:w-auto'
              variant='ghost'
              onClick={() => setIsEditing(false)}>
              Huỷ
            </Button>
          </div>
        )}
      </CardSection>

      {showDeleteConfirm && (
        <CardSection className='border border-red-200/60 bg-red-50/60'>
          <div className='flex flex-col gap-3'>
            <div>
              <p className='text-foreground text-sm font-semibold'>
                Bạn có muốn xoá ghi nhận này không?
              </p>
              <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>
                Nếu xoá, bạn sẽ không xem lại được ghi nhận này nữa.
              </p>
            </div>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
              <Button className='h-10 w-full rounded-full sm:w-auto'>Xoá ghi nhận này</Button>
              <Button
                className='text-muted-foreground hover:text-foreground h-10 w-full rounded-full sm:w-auto'
                variant='ghost'
                onClick={() => setShowDeleteConfirm(false)}>
                Giữ lại
              </Button>
            </div>
          </div>
        </CardSection>
      )}
    </div>
  )
}

export default DeedDetailPage
