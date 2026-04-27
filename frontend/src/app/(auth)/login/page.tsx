import type { Metadata } from 'next'

import LoginPage from '@/screens/login-page'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginRoutePage() {
  return <LoginPage />
}
