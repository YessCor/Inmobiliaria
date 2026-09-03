'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted ? resolvedTheme === 'dark' : false

  return (
    <button
      type="button"
      suppressHydrationWarning
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
      className="fixed right-4 top-4 z-[9999] flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-background/80 text-foreground shadow-md backdrop-blur-md transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(14,167,92,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:hover:shadow-[0_0_22px_rgba(57,255,20,0.5)]"
    >
      <Sun
        className={`absolute h-5 w-5 transition-all duration-300 ${
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
        }`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all duration-300 ${
          isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        }`}
      />
    </button>
  )
}
