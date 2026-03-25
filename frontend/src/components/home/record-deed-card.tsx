import { GoodDeedForm } from '@/components/shared/good-deed-form'
import { Card, CardContent } from '@/components/ui/card'

export const RecordDeedCard = () => {
  return (
    <Card>
      <CardContent>
        <GoodDeedForm mode='create' />
      </CardContent>
    </Card>
  )
}
