import { RefreshCwIcon, SparklesIcon } from 'lucide-react'
import React from 'react'

import { InfoButton } from '@/components/shared/info-button'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { useRandomActs } from '@/hooks/api/use-cultivation'
import { useIsMobile } from '@/hooks/shared/use-mobile'
import { INFO_COPY } from '@/lib/constants/info-copy'
import { t } from '@/lib/i18n'

export interface SuggestActsDrawerHandle {
  open: () => void
  close: () => void
}

export const SuggestActsSheet = React.forwardRef<SuggestActsDrawerHandle>((_props, ref) => {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const { data, isFetching, refetch } = useRandomActs(2, open)
  const acts = data?.data ?? []

  React.useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }))

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={isMobile ? 'rounded-t-2xl' : ''}
        side={isMobile ? 'bottom' : 'right'}>
        <SheetHeader>
          <div className='flex items-center gap-1'>
            <SheetTitle>{t('suggestActs.title')}</SheetTitle>
            <InfoButton
              description={INFO_COPY.randomActs.description}
              title={INFO_COPY.randomActs.title}
            />
          </div>
          <SheetDescription>{t('suggestActs.description')}</SheetDescription>
        </SheetHeader>

        <div className='mx-4 flex items-center justify-between gap-3'>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <SparklesIcon className='h-4 w-4' />
            {t('suggestActs.randomCount', { count: acts.length })}
          </div>
          <Button
            className='h-8 rounded-full px-3 text-xs'
            disabled={isFetching}
            size='sm'
            variant='outline'
            onClick={() => refetch()}>
            {isFetching ? <Spinner /> : <RefreshCwIcon className='h-4 w-4' />}
            {t('suggestActs.refresh')}
          </Button>
        </div>

        <div className='no-scrollbar mx-4 mt-4 flex flex-col gap-3 overflow-y-auto pb-10'>
          {acts.map((act, index) => (
            <div
              key={`${act.name}-${index}`}
              className='bg-card/80 flex items-start gap-3 rounded-2xl border border-black/5 px-4 py-3 text-sm shadow-sm'>
              <span className='text-primary mt-0.5 text-xs font-semibold'>#{index + 1}</span>
              <div className='flex flex-col gap-1'>
                <p className='text-foreground leading-relaxed'>
                  {[act.name, act.detail, act.note].filter(Boolean).join(' - ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
})
