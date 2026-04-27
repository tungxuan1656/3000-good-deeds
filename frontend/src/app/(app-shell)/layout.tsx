import type { Metadata } from 'next'

import { AppLayout } from '@/components/layout/app-layout'
import ProtectedRoute from '@/routes/protected-route'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

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
