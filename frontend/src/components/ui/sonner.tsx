import { CheckCircleIcon, InfoIcon, Loader2Icon, TriangleIcon, XCircleIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import type { CSSProperties } from 'react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      className='toaster group'
      icons={{
        success: <CheckCircleIcon className='size-4' />,
        info: <InfoIcon className='size-4' />,
        warning: <TriangleIcon className='size-4' />,
        error: <XCircleIcon className='size-4' />,
        loading: <Loader2Icon className='size-4 animate-spin' />,
      }}
      style={
        {
          '--normal-bg': '#ffffff',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
          zIndex: 9999,
        } as CSSProperties
      }
      theme={theme as ToasterProps['theme']}
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
