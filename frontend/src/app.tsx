import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import HomePage from '@/pages/home-page'
import GoalsPage from '@/pages/goals-page'
import InnerPage from '@/pages/inner-page'
import LoginPage from '@/pages/login-page'
import SettingsPage from '@/pages/settings-page'
import StatsPage from '@/pages/stats-page'
import TimelinePage from '@/pages/timeline-page'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<LoginPage />} path='/login' />
        <Route element={<HomePage />} path='/' />
        <Route element={<TimelinePage />} path='/timeline' />
        <Route element={<StatsPage />} path='/stats' />
        <Route element={<GoalsPage />} path='/goals' />
        <Route element={<InnerPage />} path='/inner' />
        <Route element={<SettingsPage />} path='/settings' />
      </Routes>
    </Router>
  )
}

export default App
