import { InfoIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { InfoDialog } from './info-dialog'

type InfoButtonProps = {
  title: string
  description: string
  className?: string
  label?: string
}

export const InfoButton = ({
  title,
  description,
  className,
  label = 'Thông tin',
}: InfoButtonProps) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        aria-label={label}
        className={className ?? 'text-muted-foreground hover:text-foreground'}
        size='icon'
        variant='ghost'
        onClick={() => setOpen(true)}>
        <InfoIcon className='h-4 w-4' />
      </Button>
      <InfoDialog description={description} open={open} title={title} onOpenChange={setOpen} />
    </>
  )
}
