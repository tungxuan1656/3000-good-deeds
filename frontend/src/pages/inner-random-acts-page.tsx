import { RefreshCwIcon, ThumbsUpIcon } from 'lucide-react'

import { CardSection } from '@/components/shared/card-section'
import { Button } from '@/components/ui/button'

const InnerRandomActsPage = () => {
  return (
    <div className='mx-auto flex w-full max-w-3xl flex-col gap-6'>
      <CardSection as='header'>
        <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
          Gieo duyên
        </p>
        <h1 className='text-foreground mt-2 text-2xl font-semibold'>Một gợi ý nhỏ</h1>
        <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
          Chọn một việc thiện nhẹ nhàng để bắt đầu hôm nay.
        </p>
      </CardSection>

      <CardSection className='gap-4'>
        <div className='rounded-2xl border border-black/5 bg-white/80 p-5'>
          <p className='text-foreground text-lg font-semibold'>Gửi một lời cảm ơn</p>
          <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
            Hãy cảm ơn một người đã giúp bạn hôm nay, dù chỉ là điều nhỏ.
          </p>
          <div className='text-muted-foreground mt-3 text-xs'>Gợi ý thuộc Khẩu thiện</div>
        </div>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
          <Button className='h-11 w-full rounded-full sm:w-auto'>
            <ThumbsUpIcon className='h-4 w-4' />
            Lưu lại
          </Button>
          <Button
            className='text-foreground h-11 w-full rounded-full border border-black/5 bg-white hover:bg-white/80 sm:w-auto'
            variant='secondary'>
            <RefreshCwIcon className='h-4 w-4' />
            Gợi ý khác
          </Button>
        </div>
      </CardSection>
    </div>
  )
}

export default InnerRandomActsPage
