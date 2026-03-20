'use client'

import { ReactNode, useEffect, useState } from 'react'
import { Menu, Building2 } from 'lucide-react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'

interface DashboardShellProps {
  user: {
    nombre: string
    apellido: string
    email: string
    rol: string
  }
  children: ReactNode
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (!sidebarOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [sidebarOpen])

  return (
    <div className="min-h-screen bg-secondary/30">
      <DashboardSidebar
        user={user}
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <div className={sidebarCollapsed ? 'md:pl-0' : 'md:pl-64'}>
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              if (window.innerWidth >= 768) {
                setSidebarCollapsed((v) => !v)
              } else {
                setSidebarOpen(true)
              }
            }}
            aria-label="Abrir menú de navegación"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-sm hover:bg-background/80 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-lg font-semibold text-foreground">InmoGestion</span>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}