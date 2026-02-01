import { ArrowRight } from 'lucide-react'

import { MobileContainer } from '@/components/layout/mobile-container'
import { Button } from '@/components/ui/button'

const LoginPage = () => {
  return (
    <MobileContainer className='bg-background justify-center px-8 pb-20'>
      <div className='flex flex-col items-center space-y-8 text-center'>
        {/* Logo / Brand */}
        <div className='bg-primary/10 mb-4 flex h-24 w-24 rotate-3 items-center justify-center rounded-3xl'>
          <span className='text-4xl'>🌱</span>
        </div>

        <div className='space-y-4'>
          <h1 className='text-foreground text-3xl font-bold tracking-tight'>3000 Good Deeds</h1>
          <p className='text-muted-foreground mx-auto max-w-70 text-lg leading-relaxed'>
            Mỗi việc thiện nhỏ là một hạt giống cho khu vườn hạnh phúc.
          </p>
        </div>

        <div className='w-full max-w-xs space-y-4 pt-8'>
          <Button className='bg-primary hover:bg-primary/90 h-12 w-full rounded-full text-base font-medium text-white transition-all hover:scale-[1.02] active:scale-[0.98]'>
            Đăng nhập với Google
          </Button>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='border-muted-foreground/20 w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-background text-muted-foreground px-2'>hoặc</span>
            </div>
          </div>

          <Button
            className='border-border/50 bg-surface/50 text-foreground hover:bg-surface h-12 w-full text-base font-medium'
            variant='outline'>
            Dùng thử ngay <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </div>
      </div>
    </MobileContainer>
  )
}

export default LoginPage
