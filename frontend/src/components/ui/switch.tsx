import { Switch as SwitchPrimitive } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/lib/utils'

function Switch({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: 'sm' | 'default'
}) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-surface-container-highest focus-visible:border-ring focus-visible:ring-ring/30 group/switch border-border/45 inline-flex shrink-0 items-center rounded-full border transition-all duration-300 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-6 data-[size=default]:w-10 data-[size=sm]:h-5 data-[size=sm]:w-8',
        className,
      )}
      data-size={size}
      data-slot='switch'
      {...props}>
      <SwitchPrimitive.Thumb
        className={cn(
          'bg-card pointer-events-none block rounded-full ring-0 transition-transform duration-300 group-data-[size=default]/switch:size-5 group-data-[size=sm]/switch:size-4 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0',
        )}
        data-slot='switch-thumb'
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
