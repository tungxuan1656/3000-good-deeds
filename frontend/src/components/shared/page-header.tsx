import { LeafIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  description?: string
  action?: ReactNode
}

export const PageHeader = ({ title, description, action }: PageHeaderProps) => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='mt-2 flex items-center gap-2'>
        <div className='bg-primary/10 flex size-8 items-center justify-center rounded-xl sm:size-10'>
          <LeafIcon className='text-primary size-4 fill-current/50 sm:size-6' />
        </div>
        <h1 className='font-headline text-foreground ml-2 text-2xl font-medium md:text-4xl'>
          {title}
        </h1>
        {action ? (
          <div className='ml-auto flex items-center'>{action}</div>
        ) : null}
      </div>
      {description ? (
        <p className='text-muted-foreground px-1 text-sm leading-relaxed font-light md:text-base'>
          {description}
        </p>
      ) : null}
    </div>
  )
}
