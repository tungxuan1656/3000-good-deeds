import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { AppBack, AppLayout, ScrollToTop } from '@/components/layout'
import { ErrorBoundary } from '@/components/shared'
import { PATHS } from '@/lib/constants'
import { APP_BASE_PATH } from '@/lib/utils/base-path'
import HandbookPage from '@/pages/handbook-page'
import HomePage from '@/pages/home-page'
import LoginPage from '@/pages/login-page'
import MorePage from '@/pages/more-page'
import ProgressPage from '@/pages/progress-page'
import TimelinePage from '@/pages/timeline-page'
import ProtectedRoute from '@/routes/protected-route'

import { Toaster } from './components/ui/sonner'

function App() {
  return (
    <ErrorBoundary>
      <Router basename={APP_BASE_PATH || undefined}>
        <ScrollToTop />
        <Routes>
          <Route element={<LoginPage />} path={PATHS.LOGIN} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route element={<HomePage />} path={PATHS.HOME} />
              <Route element={<TimelinePage />} path={PATHS.TIMELINE} />
              <Route element={<HandbookPage />} path={PATHS.HANDBOOK} />
              <Route element={<ProgressPage />} path={PATHS.PROGRESS} />
              <Route element={<MorePage />} path={PATHS.MORE} />
            </Route>
          </Route>
        </Routes>
        <Toaster position='top-center' />
        <AppBack />
      </Router>
    </ErrorBoundary>
  )
}

export default App
