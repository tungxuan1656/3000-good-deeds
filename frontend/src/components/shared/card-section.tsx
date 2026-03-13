import * as React from 'react'

import { cn } from '@/lib/utils'

type CardSectionVariant = 'default' | 'soft' | 'muted'

type CardSectionPadding = 'md' | 'lg'

interface CardSectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  variant?: CardSectionVariant
  padding?: CardSectionPadding
}

const variantClasses: Record<CardSectionVariant, string> = {
  default: 'bg-card/90',
  soft: 'bg-card/80',
  muted: 'bg-card/70',
}

const paddingClasses: Record<CardSectionPadding, string> = {
  md: 'p-4',
  lg: 'p-5',
}

const CardSection = ({
  as: Component = 'section',
  variant = 'default',
  padding = 'lg',
  className,
  ...props
}: CardSectionProps) => {
  return (
    <Component
      className={cn(
        'relative flex flex-col overflow-hidden rounded-3xl border border-black/5 shadow-sm',
        variantClasses[variant],
        paddingClasses[padding],
        className,
      )}
      {...props}
    />
  )
}

export { CardSection }
