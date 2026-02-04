import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import AppLayout from '@/components/layout/app-layout'
import { PATHS } from '@/lib/constants'
import AchievementsPage from '@/pages/achievements-page'
import DeedDetailPage from '@/pages/deed-detail-page'
import GoalsPage from '@/pages/goals-page'
import HomePage from '@/pages/home-page'
import InnerJournalEditorPage from '@/pages/inner-journal-editor-page'
import InnerJournalPage from '@/pages/inner-journal-page'
import InnerMeditationPage from '@/pages/inner-meditation-page'
import InnerPage from '@/pages/inner-page'
import InnerQuotePage from '@/pages/inner-quote-page'
import InnerRandomActsPage from '@/pages/inner-random-acts-page'
import LoginPage from '@/pages/login-page'
import SettingsPage from '@/pages/settings-page'
import StatsPage from '@/pages/stats-page'
import TimelinePage from '@/pages/timeline-page'
import ProtectedRoute from '@/routes/protected-route'

// Get Google Client ID from environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route element={<LoginPage />} path={PATHS.LOGIN} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route element={<HomePage />} path={PATHS.HOME} />
              <Route element={<TimelinePage />} path={PATHS.TIMELINE} />
              <Route element={<DeedDetailPage />} path={PATHS.DEED_DETAIL(':id')} />
              <Route element={<AchievementsPage />} path={PATHS.ACHIEVEMENTS} />
              <Route element={<StatsPage />} path={PATHS.STATS} />
              <Route element={<GoalsPage />} path={PATHS.GOALS} />
              <Route element={<InnerPage />} path={PATHS.INNER} />
              <Route element={<InnerQuotePage />} path={PATHS.INNER_QUOTE} />
              <Route element={<InnerRandomActsPage />} path={PATHS.INNER_RANDOM_ACTS} />
              <Route element={<InnerJournalPage />} path={PATHS.INNER_JOURNAL} />
              <Route element={<InnerJournalEditorPage />} path={PATHS.INNER_JOURNAL_NEW} />
              <Route
                element={<InnerJournalEditorPage />}
                path={PATHS.INNER_JOURNAL_DETAIL(':id')}
              />
              <Route element={<InnerMeditationPage />} path={PATHS.INNER_MEDITATION} />
              <Route element={<SettingsPage />} path={PATHS.SETTINGS} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App
