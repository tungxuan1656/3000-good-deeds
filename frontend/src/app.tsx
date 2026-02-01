import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import HomePage from '@/pages/home-page'
import LoginPage from '@/pages/login-page'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<LoginPage />} path='/login' />
        <Route element={<HomePage />} path='/' />
      </Routes>
    </Router>
  )
}

export default App
