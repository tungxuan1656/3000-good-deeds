import { toast } from 'sonner'

import { GoodDeedForm } from '@/components/shared/good-deed-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateDeed } from '@/hooks/api/use-deeds'
import { t } from '@/lib/i18n'

export const RecordDeedCard = () => {
  const createDeed = useCreateDeed()

  const handleSubmit = async (payload: {
    description?: string
    labels?: string
    performedAt?: number
  }) => {
    try {
      await createDeed.mutateAsync(payload)

      toast.success(t('common.success.saved'))
    } catch (_error) {
      toast.error(t('common.errors.saveFailed'))
      throw _error
    }
  }

  return (
    <Card padding='none' variant='standard'>
      <CardHeader className='p-8 pb-0'>
        <CardTitle className='sr-only'>{t('deeds.form.title')}</CardTitle>
      </CardHeader>

      <CardContent className='space-y-6 p-8 pt-6'>
        <GoodDeedForm
          isSubmitting={createDeed.isPending}
          mode='create'
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  )
}
