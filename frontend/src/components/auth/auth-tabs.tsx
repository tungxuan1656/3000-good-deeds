import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export type AuthMode = 'login' | 'register' | 'forgot'

interface AuthTabsProps {
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
}

export const AuthTabs = ({ mode, onModeChange }: AuthTabsProps) => {
  const tabs: { id: AuthMode; label: string; align?: 'right' }[] = [
    { id: 'login', label: t('auth.form.modes.login') },
    { id: 'register', label: t('auth.form.modes.register') },
    { id: 'forgot', label: t('auth.form.modes.forgot'), align: 'right' },
  ]

  return (
    <div className='border-outline-variant/30 mb-0 flex border-b px-2'>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={cn(
            'flex-1 py-3 text-xs font-bold tracking-widest uppercase transition-colors',
            tab.align === 'right' ? 'text-right' : 'text-center',
            mode === tab.id
              ? 'text-primary border-primary border-b-2'
              : 'text-muted-foreground hover:text-primary',
          )}
          onClick={() => onModeChange(tab.id)}>
          {tab.label}
        </button>
      ))}
    </div>
  )
}
