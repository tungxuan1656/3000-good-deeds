import { Share2Icon, SparklesIcon } from 'lucide-react'

import { CardSection } from '@/components/shared/card-section'
import { Button } from '@/components/ui/button'

const InnerQuotePage = () => {
  return (
    <div className='mx-auto flex w-full max-w-3xl flex-col gap-4'>
      <CardSection as='header'>
        <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
          Pháp ngữ
        </p>
        <h1 className='text-foreground mt-2 text-2xl font-semibold tracking-tight'>
          Pháp ngữ hôm nay
        </h1>
        <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
          Một câu nhắc để bạn trở về với sự dịu dàng.
        </p>
      </CardSection>

      <CardSection className='gap-4'>
        <div className='text-muted-foreground flex items-center gap-3 text-xs'>
          <SparklesIcon className='text-primary h-4 w-4' />
          Thứ ba, 15/10/2026
        </div>
        <p className='text-foreground text-xl leading-relaxed font-medium italic'>
          “Mỗi việc thiện nhỏ đều gieo một hạt giống an lành trong tâm.”
        </p>
        <p className='text-muted-foreground text-sm'>— Thiện tâm</p>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
          <Button className='h-11 w-full rounded-full sm:w-auto'>Lưu vào nhật ký</Button>
          <Button
            className='text-foreground h-11 w-full rounded-full border border-black/5 bg-white hover:bg-white/80 sm:w-auto'
            variant='secondary'>
            <Share2Icon className='h-4 w-4' />
            Chia sẻ
          </Button>
        </div>
      </CardSection>
    </div>
  )
}

export default InnerQuotePage
