import React from 'react'

interface AuthFieldProps {
  label: string
  children: React.ReactNode
}

export const AuthField = ({ label, children }: AuthFieldProps) => {
  return (
    <div className='space-y-2'>
      <label className='text-on-surface-variant block px-1 text-[10px] font-bold tracking-[0.15em] uppercase'>
        {label}
      </label>
      {children}
    </div>
  )
}
