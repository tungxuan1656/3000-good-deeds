import type React from 'react'

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty'

export const EmptyDataView = ({
  Icon,
  title,
  description,
}: {
  Icon?: React.ReactElement
  title: string
  description: string
}) => {
  return (
    <Empty>
      <EmptyHeader>
        {!!Icon && <EmptyMedia variant='icon'>{Icon}</EmptyMedia>}
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
