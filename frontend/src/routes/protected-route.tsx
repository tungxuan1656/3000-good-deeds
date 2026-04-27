'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { PATHS } from '@/lib/constants'
import { useAuthStore } from '@/stores/auth.store'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const isAuthenticated = useAuthStore.use.isAuthenticated()
  const hasHydrated = useAuthStore.use._hasHydrated()

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace(PATHS.LOGIN)
    }
  }, [hasHydrated, isAuthenticated, router])

  if (!hasHydrated) {
    return null
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute
