import { useIsMobile } from '@/hooks/shared/use-mobile'
import { t } from '@/lib/i18n'
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
        className={isMobile ? 'rounded-t-2xl' : ''}
        showCloseButton={false}
        side={isMobile ? 'bottom' : 'right'}>
        <div className='p-4'>
          <GoodDeedForm
            showActions
            initialValue={
              mode === 'edit' ? editingDeed || undefined : undefined
            }
            mode={mode}
            resetOnSuccess={false}
            showHeader={mode === 'create'}
            submitLabel={
              mode === 'edit'
                ? t('deeds.form.actions.saveChanges')
                : t('deeds.form.actions.record')
            }
            onSuccess={reset}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
