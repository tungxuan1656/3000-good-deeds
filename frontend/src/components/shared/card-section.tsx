import * as React from 'react'

import { Card, type CardProps } from '@/components/ui/card'

interface CardSectionProps extends CardProps {
  as?: React.ElementType
}

const CardSection = ({
  as: Component = 'section',
  variant = 'standard',
  padding = 'md',
  className,
  ...props
}: CardSectionProps) => {
  return (
    <Card as={Component} className={className} padding={padding} variant={variant} {...props} />
  )
}

export { CardSection }
