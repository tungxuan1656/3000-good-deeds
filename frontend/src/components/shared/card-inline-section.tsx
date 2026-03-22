import { cn } from '@/lib/utils'

export const CardInlineSection = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={cn(
        'bg-surface-container-high hover:bg-surface-container-highest flex flex-col gap-2 rounded-2xl px-4 py-3 transition-colors duration-300',
        props.className,
      )}
    />
  )
}
