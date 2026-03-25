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
        `tracking-xs rounded-sm border px-3 py-0.5 text-sm transition-colors duration-300`,
        isActive
          ? 'border-primary/35 bg-primary/20 text-primary'
          : 'text-muted-foreground bg-secondary/10 border-border',
        className,
      )}
      type='button'
      onClick={onToggle}>
      {label}
    </button>
  )
}
