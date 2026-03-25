import * as React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '@/lib/utils'

const cardVariants = tv({
  base: 'rounded-xl transition-all duration-200',
  variants: {
    variant: {
      emphasis:
        'bg-white border-none shadow-[0px_10px_30px_rgba(47,52,46,0.08)] dark:bg-stone-900/50',
      standard:
        'bg-white border border-stone-200/20 shadow-none dark:bg-stone-900/50 dark:border-stone-800',
      surface:
        'bg-surface-container-low border-none shadow-none dark:bg-stone-900/30',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4 md:p-6',
      md: 'p-6 md:p-8',
      lg: 'p-8 md:p-10',
    },
  },
  defaultVariants: {
    variant: 'standard',
    padding: 'md',
  },
})

export interface CardProps
  extends React.ComponentProps<'div'>, VariantProps<typeof cardVariants> {}

function Card({ className, variant, padding, ...props }: CardProps) {
  return (
    <div
      className={cn(cardVariants({ variant, padding }), className)}
      data-slot='card'
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-1.5 p-6 pb-4', className)}
      data-slot='card-header'
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'font-headline text-primary text-xl leading-none font-bold tracking-tight',
        className,
      )}
      data-slot='card-title'
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('text-muted-foreground text-sm', className)}
      data-slot='card-description'
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('', className)} data-slot='card-content' {...props} />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex items-center p-6 pt-0', className)}
      data-slot='card-footer'
      {...props}
    />
  )
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
