import { Navigate, Outlet } from 'react-router-dom'

import { Spinner } from '@/components/ui/spinner'
import { PATHS } from '@/lib/constants'
import { useAuthStore } from '@/stores/auth-store'

const ProtectedRoute = () => {
  const isSessionChecked = useAuthStore.use.isSessionChecked()
  const isAuthenticated = useAuthStore.use.isAuthenticated()

  if (!isSessionChecked) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate replace to={PATHS.LOGIN} />
  }

  return <Outlet />
}

export default ProtectedRoute
