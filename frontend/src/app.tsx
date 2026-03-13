import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { AppBack, AppLayout, ScrollToTop } from '@/components/layout'
import { useBootstrapSession } from '@/hooks/shared/use-bootstrap-session'
import { PATHS } from '@/lib/constants'
import GoalsPage from '@/pages/goals-page'
import HomePage from '@/pages/home-page'
import InnerJournalHistoryPage from '@/pages/inner-journal-history-page'
import InnerJournalPage from '@/pages/inner-journal-page'
import InnerPage from '@/pages/inner-page'
import InnerRandomActsPage from '@/pages/inner-random-acts-page'
import LoginPage from '@/pages/login-page'
import MorePage from '@/pages/more-page'
import PrivacyPolicyPage from '@/pages/privacy-policy-page'
import SettingsPage from '@/pages/settings-page'
import StatsPage from '@/pages/stats-page'
import TermsOfUsePage from '@/pages/terms-of-use-page'
import TimelinePage from '@/pages/timeline-page'
import ProtectedRoute from '@/routes/protected-route'

import { Toaster } from './components/ui/sonner'

// Get Google Client ID from environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

function App() {
  useBootstrapSession()

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<LoginPage />} path={PATHS.LOGIN} />
          <Route element={<TermsOfUsePage />} path={PATHS.TERMS} />
          <Route element={<PrivacyPolicyPage />} path={PATHS.PRIVACY} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route element={<HomePage />} path={PATHS.HOME} />
              <Route element={<TimelinePage />} path={PATHS.TIMELINE} />
              <Route element={<StatsPage />} path={PATHS.STATS} />
              <Route element={<GoalsPage />} path={PATHS.GOALS} />
              <Route element={<InnerPage />} path={PATHS.INNER} />
              <Route element={<InnerRandomActsPage />} path={PATHS.INNER_RANDOM_ACTS} />
              <Route element={<InnerJournalPage />} path={PATHS.INNER_JOURNAL} />
              <Route element={<InnerJournalHistoryPage />} path={PATHS.INNER_JOURNAL_HISTORY} />
              <Route element={<MorePage />} path={PATHS.MORE} />
              <Route element={<SettingsPage />} path={PATHS.SETTINGS} />
            </Route>
          </Route>
        </Routes>
        <Toaster position='top-center' />
        <AppBack />
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App
