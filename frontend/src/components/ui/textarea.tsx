import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'placeholder:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border-border/50 bg-surface-container-low/70 focus-visible:border-ring/30 focus-visible:bg-surface-container-low focus-visible:ring-ring/20 flex field-sizing-content min-h-16 w-full rounded-lg border px-3 py-2 text-base transition-[background-color,color,box-shadow] duration-300 outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      data-slot='textarea'
      {...props}
    />
  )
}

export { Textarea }
