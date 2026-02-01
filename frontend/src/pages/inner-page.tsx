import { BookOpenIcon, HeartHandshakeIcon, LeafIcon, SparklesIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { CardSection } from '@/components/shared/card-section'

const InnerPage = () => {
  return (
    <div className='mx-auto flex w-full max-w-3xl flex-col gap-4'>
      <CardSection as='header'>
        <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
          Nội tâm
        </p>
        <h1 className='text-foreground mt-2 text-2xl font-semibold tracking-tight'>
          Kho tàng an yên
        </h1>
        <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
          Pháp ngữ, sổ tay, thiền thở — tất cả ở một nơi yên tĩnh.
        </p>
      </CardSection>

      <CardSection className='gap-4'>
        <p className='text-foreground text-base font-semibold'>Chọn một không gian</p>
        <div className='flex flex-col gap-3'>
          <Link
            className='flex items-center gap-4 rounded-2xl border border-black/5 bg-white/80 px-4 py-4 transition-colors hover:bg-white'
            to='/inner/quote'>
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100'>
              <SparklesIcon className='h-5 w-5 text-amber-600' />
            </div>
            <div className='flex-1'>
              <p className='text-foreground text-base font-semibold'>Pháp ngữ hôm nay</p>
              <p className='text-muted-foreground mt-1 text-sm'>Đọc một câu nhắc dịu nhẹ.</p>
            </div>
          </Link>

          <Link
            className='flex items-center gap-4 rounded-2xl border border-black/5 bg-white/80 px-4 py-4 transition-colors hover:bg-white'
            to='/inner/random-acts'>
            <div className='bg-secondary/40 flex h-12 w-12 items-center justify-center rounded-2xl'>
              <HeartHandshakeIcon className='text-primary h-5 w-5' />
            </div>
            <div className='flex-1'>
              <p className='text-foreground text-base font-semibold'>Gieo duyên</p>
              <p className='text-muted-foreground mt-1 text-sm'>Một việc thiện nhỏ để bắt đầu.</p>
            </div>
          </Link>

          <Link
            className='flex items-center gap-4 rounded-2xl border border-black/5 bg-white/80 px-4 py-4 transition-colors hover:bg-white'
            to='/inner/journal'>
            <div className='bg-mind/20 flex h-12 w-12 items-center justify-center rounded-2xl'>
              <BookOpenIcon className='text-primary h-5 w-5' />
            </div>
            <div className='flex-1'>
              <p className='text-foreground text-base font-semibold'>Sổ tay tâm hồn</p>
              <p className='text-muted-foreground mt-1 text-sm'>Viết lại điều bạn muốn giữ.</p>
            </div>
          </Link>

          <Link
            className='flex items-center gap-4 rounded-2xl border border-black/5 bg-white/80 px-4 py-4 transition-colors hover:bg-white'
            to='/inner/meditation'>
            <div className='bg-body/20 flex h-12 w-12 items-center justify-center rounded-2xl'>
              <LeafIcon className='text-primary h-5 w-5' />
            </div>
            <div className='flex-1'>
              <p className='text-foreground text-base font-semibold'>Thiền & thở</p>
              <p className='text-muted-foreground mt-1 text-sm'>Thở sâu, trở về hiện tại.</p>
            </div>
          </Link>
        </div>
      </CardSection>
    </div>
  )
}

export default InnerPage
