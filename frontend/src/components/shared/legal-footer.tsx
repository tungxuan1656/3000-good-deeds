import { CopyIcon } from 'lucide-react'
import { toast } from 'sonner'

import { APP_VERSION, SUPPORT_EMAIL } from '@/lib/constants/app-meta'
import { t } from '@/lib/i18n'
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
      toast.success(t('legal.messages.copySuccess'))
    } catch {
      toast.error(t('legal.messages.copyFailed'))
    }
  }

  return (
    <div className={cn('px-4', className)}>
      <div className='flex flex-col gap-2'>
        <p className='text-muted-foreground/80 text-xs leading-relaxed'>
          {t('legal.contentPrefix')}{' '}
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
            <span className='font-medium'>{t('legal.emailNotConfigured')}</span>
          )}
          .
        </p>

        <p className='text-muted-foreground text-xs leading-relaxed'>
          {t('legal.readMorePrefix')} {t('legal.terms')} {t('legal.and')}{' '}
          {t('legal.privacy')}.
        </p>

        <p className='text-muted-foreground/70 text-center text-xs leading-relaxed'>
          {t('legal.version')}
          {`: ${APP_VERSION}`}
        </p>
      </div>
    </div>
  )
}
