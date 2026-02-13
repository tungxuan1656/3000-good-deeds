import { CopyIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { APP_VERSION, PATHS, SUPPORT_EMAIL } from '@/lib/constants'
import { cn } from '@/lib/utils'

type LegalFooterProps = {
  className?: string
}

export const LegalFooter = ({ className }: LegalFooterProps) => {
  const email = SUPPORT_EMAIL

  const handleCopyEmail = async () => {
    if (!email) return

    try {
      await navigator.clipboard.writeText(email)
      toast.success('Đã sao chép email hỗ trợ')
    } catch {
      toast.error('Không thể sao chép email')
    }
  }

  return (
    <div className={cn('px-4', className)}>
      <div className='flex flex-col gap-2'>
        <p className='text-muted-foreground/80 text-xs leading-relaxed'>
          Nội dung có thể có sai sót trong quá trình biên tập. Để góp ý và báo lỗi nội dung, vui
          lòng gửi về email:{' '}
          {email ? (
            <>
              <button
                className='text-foreground font-medium underline underline-offset-2'
                type='button'
                onClick={handleCopyEmail}>
                <span className='flex items-center gap-1'>
                  {email}
                  <CopyIcon className='h-3.5 w-3.5' />
                </span>
              </button>
            </>
          ) : (
            <span className='font-medium'>chưa cấu hình</span>
          )}
          .
        </p>

        <p className='text-muted-foreground text-xs leading-relaxed'>
          Bạn có thể đọc thêm về{' '}
          <Link className='hover:text-foreground underline underline-offset-2' to={PATHS.TERMS}>
            Điều khoản sử dụng
          </Link>{' '}
          và{' '}
          <Link className='hover:text-foreground underline underline-offset-2' to={PATHS.PRIVACY}>
            Chính sách riêng tư
          </Link>
          .
        </p>

        <p className='text-muted-foreground/70 text-center text-xs leading-relaxed'>
          Phiên bản: {APP_VERSION}
        </p>
      </div>
    </div>
  )
}
