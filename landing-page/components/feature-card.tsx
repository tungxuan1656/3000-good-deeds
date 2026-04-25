type FeatureCardProps = {
  step: string
  title: string
  description: string
}

export function FeatureCard({ step, title, description }: FeatureCardProps) {
  return (
    <article className='group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-(--brand-primary)'>
      <p className='text-xs font-bold tracking-[0.2em] text-(--brand-primary) uppercase'>
        {step}
      </p>
      <h3 className='mt-3 text-lg font-semibold tracking-tight text-slate-900'>
        {title}
      </h3>
      <p className='mt-3 text-sm leading-6 text-slate-700'>{description}</p>
      <div className='pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full bg-(--brand-accent)/20 blur-2xl' />
    </article>
  )
}

