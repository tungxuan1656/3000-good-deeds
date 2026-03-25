import { GoodDeedForm } from '@/components/shared/good-deed-form'
import { Card, CardContent } from '@/components/ui/card'

export const RecordDeedCard = () => {
  return (
    <Card padding='sm' variant='standard'>
      <CardContent>
        <GoodDeedForm mode='create' />
      </CardContent>
    </Card>
  )
}
