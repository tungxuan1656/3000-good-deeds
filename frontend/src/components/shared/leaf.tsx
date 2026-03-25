import { cn } from '@/lib/utils'

type LeafVariant = 1 | 2 | 3 | 4 | 5

type LeafPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center-left'
  | 'center-right'

interface LeafProps {
  variant: LeafVariant
  position?: LeafPosition
  className?: string
}

const positionClasses: Record<LeafPosition, string> = {
  'top-left': '-top-4 -left-4',
  'top-right': '-top-4 -right-4',
  'bottom-left': '-bottom-4 -left-4',
  'bottom-right': '-bottom-4 -right-4',
  'center-left': 'top-1/2 -left-4 -translate-y-1/2',
  'center-right': 'top-1/2 -right-4 -translate-y-1/2',
}

export const Leaf = ({
  variant,
  position = 'top-right',
  className,
}: LeafProps) => {
  return (
    <img
      alt=''
      aria-hidden='true'
      className={cn(
        'pointer-events-none absolute h-28 w-28 opacity-25 mix-blend-multiply blur-[1px]',
        positionClasses[position],
        className,
      )}
      src={`/icons/icon_leaf_${variant}.png`}
    />
  )
}
