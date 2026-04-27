'use client'

import '@/lib/i18n'

import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { useEffect } from 'react'

import { Toaster } from '@/components/ui/sonner'
import { registerServiceWorker } from '@/lib/utils/push-sw'

const SIX_HOURS = 1000 * 60 * 60 * 6

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

let hasPersistedQueryClient = false

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (hasPersistedQueryClient || typeof window === 'undefined') {
      return
    }

    const persister = createAsyncStoragePersister({
      storage: window.localStorage,
    })

    persistQueryClient({
      queryClient,
      persister,
      maxAge: SIX_HOURS,
    })

    hasPersistedQueryClient = true
  }, [])

  useEffect(() => {
    void registerServiceWorker()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position='top-center' />
    </QueryClientProvider>
  )
}
