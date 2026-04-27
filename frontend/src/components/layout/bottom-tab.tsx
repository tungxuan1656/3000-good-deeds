'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { BOTTOM_TAB_ITEMS, PATHS } from '@/lib/constants'
import { cn } from '@/lib/utils'

const isPathActive = (pathname: string, targetPath: string) => {
  if (targetPath === PATHS.HOME) return pathname === PATHS.HOME

  return pathname.startsWith(targetPath)
}

export const BottomTab = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    return () => setMounted(false)
  }, [])

  useEffect(() => {
    for (const { path } of BOTTOM_TAB_ITEMS) {
      if (path === pathname) continue
      router.prefetch(path)
    }
  }, [pathname, router])

  if (!mounted) {
    return null
  }

  return createPortal(
    <div className='fixed inset-x-0 bottom-0 z-80 md:hidden'>
      <div className='pb-safe bg-surface-container/50 border-border/50 pointer-events-auto rounded-t-3xl border-t shadow-md backdrop-blur-lg'>
        <div className='flex items-center justify-between px-1 py-3'>
          {BOTTOM_TAB_ITEMS.map(({ label, path, icon: Icon }) => {
            const active = isPathActive(pathname, path)

            return (
              <Link
                key={label}
                prefetch
                className='flex flex-1 touch-manipulation flex-col items-center justify-center gap-1.5 transition-all duration-300'
                href={path}>
                <Icon
                  className={cn(
                    'size-5 transition-colors duration-300',
                    active
                      ? 'text-primary fill-primary/20'
                      : 'text-muted-foreground/60',
                  )}
                />
                <span
                  className={cn(
                    'text-[8px] font-bold tracking-widest uppercase transition-colors duration-300',
                    active ? 'text-primary' : 'text-muted-foreground/60',
                  )}>
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>,
    document.body,
  )
}
