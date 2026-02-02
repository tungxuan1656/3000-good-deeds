import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import AppLayout from '@/components/layout/app-layout'
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

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<LoginPage />} path='/login' />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route element={<HomePage />} path='/' />
            <Route element={<TimelinePage />} path='/timeline' />
            <Route element={<DeedDetailPage />} path='/deeds/:id' />
            <Route element={<AchievementsPage />} path='/achievements' />
            <Route element={<StatsPage />} path='/stats' />
            <Route element={<GoalsPage />} path='/goals' />
            <Route element={<InnerPage />} path='/inner' />
            <Route element={<InnerQuotePage />} path='/inner/quote' />
            <Route element={<InnerRandomActsPage />} path='/inner/random-acts' />
            <Route element={<InnerJournalPage />} path='/inner/journal' />
            <Route element={<InnerJournalEditorPage />} path='/inner/journal/new' />
            <Route element={<InnerJournalEditorPage />} path='/inner/journal/:id' />
            <Route element={<InnerMeditationPage />} path='/inner/meditation' />
            <Route element={<SettingsPage />} path='/settings' />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
