'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Mostrar botón siempre, pero con tema resolvedTheme para mostrar el icono correcto
  const currentTheme = mounted ? (resolvedTheme || 'light') : 'light'

  return (
    <button
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
      className="fixed top-4 right-4 z-[9999] flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-background shadow-lg hover:bg-accent transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.8)] hover:border-green-400"
      aria-label={`Cambiar a modo ${currentTheme === 'dark' ? 'claro' : 'oscuro'}`}
      style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 9999 }}
    >
      {currentTheme === 'dark' ? (
        <Sun className="h-5 w-5 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
      )}
    </button>
  )
}
