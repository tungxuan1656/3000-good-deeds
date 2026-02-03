import { Navigate, Outlet } from 'react-router-dom'

import { PATHS } from '@/lib/constants'
import { useAuthStore } from '@/stores/auth-store'

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore.use.isAuthenticated()

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate replace to={PATHS.LOGIN} />
  }

  return <Outlet />
}

export default ProtectedRoute
