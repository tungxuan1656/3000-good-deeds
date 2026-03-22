import { SparklesIcon } from 'lucide-react'

import { t } from '@/lib/i18n'

export const CheckInSheetTip = () => {
  return (
    <div className='bg-card/80 border-border/45 flex items-center gap-3 rounded-2xl border p-4'>
      <div className='bg-secondary/40 flex h-10 w-10 items-center justify-center rounded-full'>
        <SparklesIcon className='text-primary h-5 w-5' />
      </div>
      <div>
        <p className='text-foreground text-sm font-medium'>{t('checkIn.sheet.footerTitle')}</p>
        <p className='text-muted-foreground text-xs'>{t('checkIn.sheet.footerDescription')}</p>
      </div>
    </div>
  )
}
