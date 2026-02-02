export function MainContainer(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className='grid gap-6 lg:grid-cols-[1fr_320px]' {...props} />
}

export function MainColumn(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className='flex flex-col gap-4' {...props} />
}

export function SideColumn(props: React.HTMLAttributes<HTMLDivElement>) {
  return <aside className='flex flex-col gap-4' {...props} />
}
