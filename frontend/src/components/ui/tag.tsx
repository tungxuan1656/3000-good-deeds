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
        `rounded-full border px-3 py-1 text-sm transition-colors duration-300`,
        isActive
          ? 'border-primary/35 bg-primary/12 text-primary'
          : 'text-foreground bg-secondary/55 border-transparent',
        className,
      )}
      type='button'
      onClick={onToggle}>
      {label}
    </button>
  )
}
