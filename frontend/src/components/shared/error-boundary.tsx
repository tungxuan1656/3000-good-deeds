'use client'

import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'

import { t } from '@/lib/i18n'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className='flex h-screen flex-col items-center justify-center gap-4 p-8 text-center'>
            <p className='text-foreground text-base font-semibold'>
              {t('common.errors.errorOccurred')}
            </p>
            <button
              className='text-primary text-sm underline'
              onClick={() => window.location.reload()}>
              {t('common.errors.reloadPage')}
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}
