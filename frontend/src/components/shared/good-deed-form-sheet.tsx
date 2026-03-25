import { toast } from 'sonner'

import { useCreateDeed, useUpdateDeed } from '@/hooks/api/use-deeds'
import { useIsMobile } from '@/hooks/shared/use-mobile'
import { t } from '@/lib/i18n'
import { useGoodDeedStore } from '@/stores/good-deed.store'
import type { UpdateDeedRequest } from '@/types/api'

import { Sheet, SheetContent } from '../ui/sheet'
import { GoodDeedForm } from './good-deed-form'

export const GoodDeedFormSheet = () => {
  const isMobile = useIsMobile()
  const createDeed = useCreateDeed()
  const updateDeed = useUpdateDeed()

  const isOpen = useGoodDeedStore.use.isOpen()
  const mode = useGoodDeedStore.use.mode()
  const editingDeed = useGoodDeedStore.use.editingDeed()
  const reset = useGoodDeedStore.use.reset()

  const handleSubmit = async (payload: UpdateDeedRequest) => {
    try {
      if (mode === 'edit' && editingDeed) {
        await updateDeed.mutateAsync({
          id: editingDeed.id,
          data: payload,
        })

        toast.success(t('deeds.edit.messages.updated'))
      } else {
        await createDeed.mutateAsync(payload)
        toast.success(t('common.success.saved'))
      }

      reset()
    } catch (error) {
      if (mode === 'edit') {
        toast.error(t('deeds.edit.messages.updateFailed'))
      } else {
        toast.error(t('common.errors.saveFailed'))
      }

      throw error
    }
  }

  const isSubmitting = createDeed.isPending || updateDeed.isPending

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
            isSubmitting={isSubmitting}
            mode={mode}
            resetOnSuccess={false}
            showHeader={mode === 'create'}
            submitLabel={
              mode === 'edit'
                ? t('deeds.form.actions.saveChanges')
                : t('deeds.form.actions.record')
            }
            onSubmit={handleSubmit}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
