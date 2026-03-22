import { t } from '@/lib/i18n'

interface AuthFooterProps {
  version: string
}

export const AuthFooter = ({ version }: AuthFooterProps) => {
  return (
    <div className='mt-10 text-center'>
      <div className='flex items-center justify-center gap-4 pt-4'>
        <span className='text-muted-foreground hover:text-primary cursor-pointer text-[10px] font-medium tracking-widest uppercase transition-colors'>
          {t('auth.login.termsLabel')}
        </span>
        <div className='bg-outline-variant/40 h-1 w-1 rounded-full' />
        <span className='text-muted-foreground hover:text-primary cursor-pointer text-[10px] font-medium tracking-widest uppercase transition-colors'>
          {t('auth.login.privacyLabel')}
        </span>
      </div>
      <p className='text-muted-foreground/60 mt-4 text-center text-xs leading-relaxed'>
        {t('auth.login.version', { version })}
      </p>
    </div>
  )
}
