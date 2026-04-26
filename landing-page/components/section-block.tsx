import { type ReactNode } from 'react'

type SectionBlockProps = {
  id?: string
  title: string
  description?: string
  children?: ReactNode
  tone?: 'surface' | 'muted'
}

export function SectionBlock({
  id,
  title,
  description,
  children,
  tone = 'surface',
}: SectionBlockProps) {
  const sectionClassName =
    tone === 'muted'
      ? 'border-y border-slate-200 bg-(--surface-muted)'
      : 'bg-(--surface)'

  return (
    <section id={id} className={sectionClassName}>
      <div className="mx-auto w-full max-w-6xl px-6 py-14 md:py-16">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </section>
  )
}
