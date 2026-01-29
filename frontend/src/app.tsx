import './app.css'

import { useState } from 'react'

import appLogo from '/favicon.svg'

import reactLogo from './assets/react.svg'
import PWABadge from './pwa-badge'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href='https://vite.dev' target='_blank'>
          <img alt='3000-good-deeds logo' className='logo' src={appLogo} />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img alt='React logo' className='logo react' src={reactLogo} />
        </a>
      </div>
      <h1>3000-good-deeds</h1>
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
      <PWABadge />
    </>
  )
}

export default App
