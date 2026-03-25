import { useIsMobile } from '@/hooks/shared/use-mobile'
import { cn } from '@/lib/utils'
import { useGoodDeedStore } from '@/stores/good-deed.store'

import { Sheet, SheetContent } from '../ui/sheet'
import { GoodDeedForm } from './good-deed-form'

export const GoodDeedFormSheet = () => {
  const isMobile = useIsMobile()

  const isOpen = useGoodDeedStore.use.isOpen()
  const mode = useGoodDeedStore.use.mode()
  const editingDeed = useGoodDeedStore.use.editingDeed()
  const reset = useGoodDeedStore.use.reset()

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && reset()}>
      <SheetContent
        className={cn(
          isMobile ? 'rounded-t-2xl' : '',
          'bg-surface-container-lowest z-100 pb-20',
        )}
        showCloseButton={false}
        side={isMobile ? 'bottom' : 'right'}>
        <div className='p-4'>
          <GoodDeedForm
            initialValue={
              mode === 'edit' ? editingDeed || undefined : undefined
            }
            mode={mode}
            onSuccess={reset}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
