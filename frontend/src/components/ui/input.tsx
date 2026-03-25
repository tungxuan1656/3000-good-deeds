import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground/40 selection:bg-primary selection:text-primary-foreground border-border/20 bg-surface-container-low/70 rounded-eight h-11 w-full min-w-0 border px-4 py-2 text-base transition-all duration-300 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring/30 focus-visible:bg-surface-container-low focus-visible:ring-ring/20 focus-visible:ring-1',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        className,
      )}
      data-slot='input'
      type={type}
      {...props}
    />
  )
}

export { Input }
