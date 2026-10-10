'use client'

import type { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/SCN/sonner'
import { TooltipProvider } from '@/components/SCN/tooltip'
import { PINNED_THEME } from '@/lib/constants-theme'

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={PINNED_THEME ?? 'system'}
      forcedTheme={PINNED_THEME ?? undefined}
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  )
}
