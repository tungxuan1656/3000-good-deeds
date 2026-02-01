import { ArrowRight } from 'lucide-react'

import { MobileContainer } from '@/components/layout/mobile-container'
import { Button } from '@/components/ui/button'

const LoginPage = () => {
  return (
    <MobileContainer className='justify-center bg-transparent px-8 pb-20'>
      <div className='flex flex-col items-center space-y-10 text-center'>
        {/* Brand Section */}
        <div className='relative flex flex-col items-center gap-6'>
          <div className='flex h-28 w-28 rotate-3 items-center justify-center rounded-4xl bg-linear-to-br from-white to-white/50 shadow-sm ring-1 ring-black/5 backdrop-blur-md'>
            <span className='text-6xl drop-shadow-sm filter'>🌱</span>
          </div>

          <div className='space-y-3'>
            <h1 className='text-foreground font-sans text-3xl font-bold tracking-tight sm:text-4xl'>
              3000 Good Deeds
            </h1>
            <p className='text-muted-foreground/80 mx-auto max-w-65 text-lg leading-relaxed font-medium'>
              Gieo hạt giống lành
              <br />
              Gặt khu vườn hạnh phúc
            </p>
          </div>
        </div>

        {/* Action Section */}
        <div className='w-full max-w-xs space-y-5 pt-4'>
          <Button className='bg-primary shadow-primary/20 hover:bg-primary/90 h-14 w-full rounded-full text-lg font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]'>
            Tiếp tục với Google
          </Button>

          <div className='relative py-2'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t border-black/5' />
            </div>
            <div className='relative flex justify-center uppercase'>
              <span className='text-muted-foreground/50 bg-transparent px-3 text-[10px] font-bold tracking-widest'>
                HOẶC
              </span>
            </div>
          </div>

          <Button
            className='border-primary/20 text-primary hover:border-primary/50 h-14 w-full rounded-full border-2 bg-white/50 text-lg font-medium hover:bg-white'
            variant='outline'>
            Dùng thử ngay <ArrowRight className='ml-2 h-5 w-5' />
          </Button>
        </div>

        {/* Footer / Terms */}
        <p className='text-muted-foreground/50 px-8 text-xs leading-5'>
          Bằng cách tiếp tục, bạn đồng ý với{' '}
          <span className='underline decoration-dashed underline-offset-2'>Điều khoản sử dụng</span>{' '}
          và{' '}
          <span className='underline decoration-dashed underline-offset-2'>
            Chính sách riêng tư
          </span>
          .
        </p>
      </div>
    </MobileContainer>
  )
}

export default LoginPage
