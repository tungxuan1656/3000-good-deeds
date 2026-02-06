import { Skeleton } from '../ui/skeleton'

export function SkeletonList({ length = 3 }: { length?: number }) {
  return (
    <div className='flex w-full flex-col gap-7'>
      {[...Array(length)].map((_, index) => (
        <div key={index} className='flex flex-col gap-3'>
          <Skeleton className='h-4 w-1/3' />
          <Skeleton className='h-10 w-full' />
          <div className='flex items-center justify-between'>
            <Skeleton className='h-4 w-1/4' />
            <Skeleton className='h-4 w-1/3' />
          </div>
        </div>
      ))}
      <Skeleton className='h-5 w-24' />
    </div>
  )
}
