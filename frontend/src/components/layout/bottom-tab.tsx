import { useLocation, useNavigate } from 'react-router-dom'

import { BOTTOM_TAB_ITEMS, PATHS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const innerPaths = [PATHS.INNER, PATHS.INNER_JOURNAL]
const morePaths = [PATHS.MORE, PATHS.GOALS, PATHS.SETTINGS, PATHS.INNER_RANDOM_ACTS]

const isPathActive = (pathname: string, targetPath: string) => {
  if (targetPath === PATHS.HOME) return pathname === PATHS.HOME
  if (targetPath === PATHS.INNER) return innerPaths.some((path) => pathname.startsWith(path))
  if (targetPath === PATHS.MORE) return morePaths.some((path) => pathname.startsWith(path))

  return pathname.startsWith(targetPath)
}

export const BottomTab = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className='fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white backdrop-blur md:hidden'>
      <div className='mx-auto flex max-w-lg items-center justify-between px-2 py-2'>
        {BOTTOM_TAB_ITEMS.map(({ label, path, icon: Icon }) => {
          const active = isPathActive(location.pathname, path)

          return (
            <button
              key={label}
              className='flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1 transition-colors'
              type='button'
              onClick={() => navigate(path)}>
              <Icon className={cn('h-5 w-5', active ? 'text-primary' : 'text-muted-foreground')} />
              <span
                className={cn(
                  'text-xs',
                  active ? 'text-foreground font-semibold' : 'text-muted-foreground',
                )}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
      <div className='h-[env(safe-area-inset-bottom)]' />
    </div>
  )
}
