import { AppLayout } from '@/components/layout/app-layout'
import ProtectedRoute from '@/routes/protected-route'

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}
