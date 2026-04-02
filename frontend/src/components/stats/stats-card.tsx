import { LeafIcon } from 'lucide-react'

import { useStatsSummary } from '@/hooks/api/use-stats'
import { t } from '@/lib/i18n'

import { EmptyDataView } from '../shared/empty-data-view'
import { SkeletonList } from '../shared/skeleton-list'
import { Card } from '../ui'

export const StatsCard = () => {
  const { data, isLoading } = useStatsSummary()
  const summary = data?.data
  const isEmpty = !isLoading && !summary

  return (
    <>
      {isLoading && <SkeletonList length={2} />}

      {isEmpty && !isLoading && (
        <EmptyDataView
          Icon={<LeafIcon />}
          description={t('stats.card.emptyDescription')}
          title={t('stats.card.emptyTitle')}
        />
      )}

      {!isEmpty && !isLoading && (
        <Card className='flex flex-row items-center justify-between'>
          <div className='flex items-start justify-between gap-3'>
            <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase sm:text-sm'>
              {t('stats.card.recordedTitle')}
            </p>
          </div>
          <h4 className='text-foreground text-lg leading-tight font-semibold md:text-2xl'>
            {t('stats.card.totalValue', {
              count: `${summary?.totalDeeds || 0}`,
            })}
          </h4>
        </Card>
      )}
    </>
  )
}
