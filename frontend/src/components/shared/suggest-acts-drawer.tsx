import { RefreshCwIcon, SparklesIcon, XIcon } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Spinner } from '@/components/ui/spinner'
import { useRandomActs } from '@/hooks/api/use-cultivation'
import { useIsMobile } from '@/hooks/use-mobile'

export interface SuggestActsDrawerHandle {
  open: (categoryCode?: string) => void
  close: () => void
}

export const SuggestActsDrawer = React.forwardRef<SuggestActsDrawerHandle>((_props, ref) => {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const { data, isFetching, refetch } = useRandomActs(5, open)
  const acts = data?.data ?? []

  React.useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }))

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
  }

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'} open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className='flex flex-row'>
          <div className='flex-1 text-left'>
            <DrawerTitle>Gợi ý việc thiện</DrawerTitle>
            <DrawerDescription>Chọn một điều nhỏ để bắt đầu ngay hôm nay.</DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button
              aria-label='Đóng'
              className='h-9 w-9 self-start rounded-full bg-gray-200'
              size='icon'
              variant='ghost'>
              <XIcon className='h-4 w-4' />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className='mx-4 flex items-center justify-between gap-3'>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <SparklesIcon className='h-4 w-4' />
            {acts.length} gợi ý ngẫu nhiên
          </div>
          <Button
            className='h-8 rounded-full px-3 text-xs'
            disabled={isFetching}
            size='sm'
            variant='secondary'
            onClick={() => refetch()}>
            {isFetching ? <Spinner /> : <RefreshCwIcon className='h-4 w-4' />}
            Đổi gợi ý
          </Button>
        </div>

        <div className='no-scrollbar mx-4 mt-4 flex flex-col gap-3 overflow-y-auto pb-10'>
          {acts.map((act, index) => (
            <div
              key={`${act.content}-${index}`}
              className='flex items-start gap-3 rounded-2xl border border-black/5 bg-white/80 px-4 py-3 text-sm shadow-sm'>
              <span className='text-primary mt-0.5 text-xs font-semibold'>#{index + 1}</span>
              <p className='text-foreground leading-relaxed'>{act.content}</p>
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  )
})
