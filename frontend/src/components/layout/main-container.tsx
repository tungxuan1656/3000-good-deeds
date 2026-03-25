import { useIsMobile } from '@/hooks/shared/use-mobile'

export function MainContainer(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className='pt-safe grid gap-6 xl:grid-cols-[1fr_320px]' {...props} />
  )
}

export function MainColumn(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className='flex flex-col gap-4' {...props} />
}

export function SideColumn({
  hideInMobile,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hideInMobile?: boolean }) {
  const isMobile = useIsMobile()
  if (hideInMobile && isMobile) {
    return null
  }

  return <aside className='flex flex-col gap-4' {...props} />
}
