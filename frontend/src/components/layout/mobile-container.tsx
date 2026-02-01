import React from 'react'

import { cn } from '@/lib/utils'

interface MobileContainerProps {
  children: React.ReactNode
  className?: string
}

export const MobileContainer = ({ children, className }: MobileContainerProps) => {
  return (
    <div className='bg-background flex min-h-screen w-full justify-center'>
      <div
        className={cn(
          'bg-background border-border/40 relative flex min-h-screen w-full max-w-md flex-col overflow-x-hidden border-x shadow-sm',
          className,
        )}>
        {children}
      </div>
    </div>
  )
}
