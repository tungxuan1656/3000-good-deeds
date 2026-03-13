import type { ReactNode } from 'react'

import { CardSection } from './card-section'
import { Leaf } from './leaf'

type HeaderSectionProps = {
  title: string
  subtitle?: string
  description?: string
  note?: string
  action?: ReactNode
}

export const HeaderSection = ({
  title,
  subtitle,
  description,
  note,
  action,
}: HeaderSectionProps) => {
  return (
    <CardSection as='header'>
      <Leaf position='top-right' variant={1} />
      {subtitle ? (
        <p className='text-muted-foreground/70 text-xs font-semibold tracking-wider uppercase sm:text-xs'>
          {subtitle}
        </p>
      ) : null}
      <h1 className='text-foreground mt-2 text-2xl font-semibold tracking-tight sm:text-3xl'>
        {title}
      </h1>
      {description ? (
        <p className='text-muted-foreground/90 mt-3 max-w-xl text-sm leading-relaxed sm:text-base'>
          {description}
        </p>
      ) : null}
      {note || action ? (
        <div className='mt-1 flex flex-wrap items-center'>
          {note ? <p className='text-muted-foreground/90 text-sm leading-relaxed'>{note}</p> : null}
          {action ? <div className='ml-auto flex items-center'>{action}</div> : null}
        </div>
      ) : null}
    </CardSection>
  )
}
