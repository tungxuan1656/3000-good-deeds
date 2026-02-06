import { cn } from '@/lib/utils'

export const CardInlineSection = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={cn(
        'border-primary/30 flex flex-col gap-2 rounded-2xl border-2 bg-white/85 px-4 py-2 transition-shadow hover:shadow-md',
        props.className,
      )}
    />
  )
}
