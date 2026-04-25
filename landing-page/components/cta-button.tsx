type CtaButtonProps = {
  href: string
  label: string
  variant?: 'primary' | 'secondary'
}

export function CtaButton({
  href,
  label,
  variant = 'primary',
}: CtaButtonProps) {
  const baseClassName =
    'inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer'

  const variantClassName =
    variant === 'primary'
      ? 'bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-strong)] focus-visible:ring-[var(--brand-primary)]'
      : 'border border-slate-300 bg-white text-slate-900 hover:border-slate-500 hover:bg-slate-50 focus-visible:ring-slate-500'

  return (
    <a
      className={`${baseClassName} ${variantClassName}`}
      href={href}
      target='_blank'
      rel='noopener noreferrer'>
      {label}
    </a>
  )
}

