import React from 'react'

import { cn } from '@/lib/utils'

interface MobileContainerProps {
  children: React.ReactNode
  className?: string
}

export const MobileContainer = ({ children, className }: MobileContainerProps) => {
  return (
    <div className="flex min-h-screen w-full justify-center bg-[url('/background.png')] bg-cover bg-fixed bg-center bg-no-repeat">
      <div
        className={cn(
          'relative flex min-h-screen w-full max-w-lg flex-col overflow-x-hidden bg-white/40 transition-all',
          'md:bg-white/50', // Soften desktop further
          className,
        )}>
        {children}
      </div>
    </div>
  )
}
