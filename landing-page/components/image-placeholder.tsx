import type { CSSProperties } from 'react'

type ImagePlaceholderProps = {
  fileName: string
  alt: string
  ratio: CSSProperties['aspectRatio']
  description: string
}

export function ImagePlaceholder({
  fileName,
  alt,
  ratio,
  description,
}: ImagePlaceholderProps) {
  return (
    <figure className="rounded-2xl border border-dashed border-slate-300 bg-white p-3 shadow-sm">
      <div
        className="relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-slate-100"
        style={{ aspectRatio: ratio }}
        aria-label={alt}>
        <div className="px-4 text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-(--brand-primary) uppercase">
            TODO_IMAGE
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {fileName}
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-600">{alt}</p>
        </div>
      </div>
      <figcaption className="mt-3 text-sm leading-6 text-slate-700">
        {description}
      </figcaption>
    </figure>
  )
}
