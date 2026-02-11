import { Trash2Icon } from 'lucide-react'
import { useRef, useState } from 'react'

import { CardSection, ConfirmDialog } from '@/components/shared'
import type { ConfirmDialogHandle } from '@/components/shared/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface DeleteAccountCardProps {
  onConfirm?: () => void
}

const DeleteAccountCard = ({ onConfirm }: DeleteAccountCardProps) => {
  const [deleteText, setDeleteText] = useState('')
  const deleteDialogRef = useRef<ConfirmDialogHandle>(null)

  const handleDeleteOpenChange = (open: boolean) => {
    if (!open) setDeleteText('')
  }

  return (
    <>
      <CardSection className='border border-red-200/60 bg-red-50/60'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <p className='text-foreground text-base font-semibold'>Xoá tài khoản</p>
            <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>
              {
                'Tất cả dữ liệu của bạn sẽ bị xoá và không thể khôi phục lại được. Xin hãy cân nhắc kỹ lựa chọn này!'
              }
            </p>
          </div>
          <div className='flex h-9 w-9 items-center justify-center rounded-full bg-red-100'>
            <Trash2Icon className='h-4 w-4 text-red-600' />
          </div>
        </div>
        <Button
          className='mt-3 h-10 w-full rounded-full bg-red-500 text-white hover:bg-red-500/90'
          onClick={() => deleteDialogRef.current?.open()}>
          Xoá tài khoản
        </Button>
      </CardSection>

      <ConfirmDialog
        ref={deleteDialogRef}
        cancelLabel='Để sau'
        confirmDisabled={deleteText !== 'DELETE'}
        confirmLabel='Xoá tài khoản'
        description='Nhập chữ “DELETE” để xác nhận. Bạn có thể quay lại bắt đầu lại bất cứ lúc nào.'
        title='Xác nhận xoá tài khoản'
        variant='destructive'
        onConfirm={() => {
          deleteDialogRef.current?.close()
          onConfirm?.()
        }}
        onOpenChange={handleDeleteOpenChange}>
        <Input
          className='rounded-2xl border border-black/5 bg-white px-4 py-2 text-sm'
          placeholder='DELETE'
          value={deleteText}
          onChange={(event) => setDeleteText(event.target.value)}
        />
      </ConfirmDialog>
    </>
  )
}

export default DeleteAccountCard
