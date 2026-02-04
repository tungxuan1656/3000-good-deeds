import './index.css'

import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './app'

const SIX_HOURS = 1000 * 60 * 60 * 6

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

if (typeof window !== 'undefined') {
  const persister = createAsyncStoragePersister({
    storage: window.localStorage,
  })

  persistQueryClient({
    queryClient,
    persister,
    maxAge: SIX_HOURS,
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
