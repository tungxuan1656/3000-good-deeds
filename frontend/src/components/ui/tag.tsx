import { cn } from '@/lib/utils'

export const TagButton = ({
  isActive,
  onToggle,
  label,
  className,
}: {
  isActive: boolean
  onToggle: () => void
  label: string
  className?: string
}) => {
  return (
    <button
      className={cn(
        `rounded-full border px-2.5 py-1 text-sm transition-colors`,
        isActive
          ? 'bg-primary/10 border-primary text-primary'
          : 'text-foreground border-black/10 bg-card/80',
        className,
      )}
      type='button'
      onClick={onToggle}>
      {label}
    </button>
  )
}
