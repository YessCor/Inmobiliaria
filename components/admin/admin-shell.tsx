'use client'

import { ReactNode, useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { AdminSidebar } from '@/components/admin/sidebar'

interface AdminShellProps {
  user: {
    nombre: string
    apellido: string
    email: string
  }
  children: ReactNode
}

export function AdminShell({ user, children }: AdminShellProps) {
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
    <div className="relative min-h-screen">
      {/* Fondo sutil de marca */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/fondo.jpg)' }}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-0 bg-background/90 backdrop-blur-[2px] dark:bg-background/88" aria-hidden="true" />

      <div className="relative z-10 min-h-screen">
      <AdminSidebar
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-lg font-semibold text-foreground">InmoGestion</span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
            Admin
          </span>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">{children}</div>
        </main>
      </div>
      </div>
    </div>
  )
}
