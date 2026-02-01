import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import AppLayout from '@/components/layout/app-layout'
import GoalsPage from '@/pages/goals-page'
import HomePage from '@/pages/home-page'
import InnerPage from '@/pages/inner-page'
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
            <Route element={<StatsPage />} path='/stats' />
            <Route element={<GoalsPage />} path='/goals' />
            <Route element={<InnerPage />} path='/inner' />
            <Route element={<SettingsPage />} path='/settings' />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
