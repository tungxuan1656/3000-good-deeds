import * as React from 'react'

import { cn } from '@/lib/utils'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'bg-surface-container-lowest rounded-xl border-none shadow-[0px_10px_30px_rgba(47,52,46,0.04)]',
        className,
      )}
      data-slot='card'
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-1.5 p-6', className)}
      data-slot='card-header'
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('font-headline text-2xl leading-none font-semibold tracking-tight', className)}
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
  return <div className={cn('p-6 pt-0', className)} data-slot='card-content' {...props} />
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
