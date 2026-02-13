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
import { useIsMobile } from '@/hooks/use-mobile'
import { INFO_COPY } from '@/lib/info-copy'

export interface SuggestActsDrawerHandle {
  open: (categoryCode?: string) => void
  close: () => void
}

export const SuggestActsSheet = React.forwardRef<SuggestActsDrawerHandle>((_props, ref) => {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const { data, isFetching, refetch } = useRandomActs(2, open)
  const acts = data?.data ?? []
  const categoryMeta = {
    body: { label: 'Thân', className: 'bg-body/20 text-foreground' },
    speech: { label: 'Khẩu', className: 'bg-speech/20 text-foreground' },
    mind: { label: 'Ý', className: 'bg-mind/20 text-foreground' },
  }

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
            <SheetTitle>Gợi ý việc thiện</SheetTitle>
            <InfoButton
              description={INFO_COPY.randomActs.description}
              title={INFO_COPY.randomActs.title}
            />
          </div>
          <SheetDescription>Chọn một điều nhỏ để bắt đầu ngay hôm nay.</SheetDescription>
        </SheetHeader>

        <div className='mx-4 flex items-center justify-between gap-3'>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <SparklesIcon className='h-4 w-4' />
            {acts.length} gợi ý ngẫu nhiên
          </div>
          <Button
            className='h-8 rounded-full px-3 text-xs'
            disabled={isFetching}
            size='sm'
            variant='outline'
            onClick={() => refetch()}>
            {isFetching ? <Spinner /> : <RefreshCwIcon className='h-4 w-4' />}
            Đổi gợi ý
          </Button>
        </div>

        <div className='no-scrollbar mx-4 mt-4 flex flex-col gap-3 overflow-y-auto pb-10'>
          {acts.map((act, index) => (
            <div
              key={`${act.name}-${index}`}
              className='flex items-start gap-3 rounded-2xl border border-black/5 bg-white/80 px-4 py-3 text-sm shadow-sm'>
              <span className='text-primary mt-0.5 text-xs font-semibold'>#{index + 1}</span>
              <div className='flex flex-col gap-1'>
                <div className='flex flex-wrap items-center gap-2 text-xs'>
                  <span
                    className={`${categoryMeta[act.category].className} rounded-full px-2.5 py-0.5 font-semibold`}>
                    {categoryMeta[act.category].label}
                  </span>
                </div>
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
