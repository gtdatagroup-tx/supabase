'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes/dist/types'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // @ts-ignore next-themes is old :/

  return (
    <NextThemesProvider
      {...props}
      themes={['dark', 'light']}
      defaultTheme="dark"
      storageKey={'supabase-theme'}
    >
      {children}
    </NextThemesProvider>
  )
}
