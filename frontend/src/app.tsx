import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { Button } from '@/components/ui/button'

function Dashboard() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-4'>
      <h1 className='text-4xl font-bold'>3000 Good Deeds</h1>
      <p className='text-muted-foreground'>Frontend Setup Complete</p>
      <div className='flex gap-2'>
        <Button>Get Started</Button>
        <Button variant='outline'>Learn More</Button>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Dashboard />} path='/' />
      </Routes>
    </Router>
  )
}

export default App
