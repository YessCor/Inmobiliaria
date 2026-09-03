'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/lib/actions/auth'
import { Building2, FileText, Home, LogOut, MapPin, MessageSquare, CreditCard, Users, Layers, FileImage } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface AdminSidebarProps {
  user: {
    nombre: string
    apellido: string
    email: string
  }
  open?: boolean
  collapsed?: boolean
  onClose?: () => void
}

const adminLinks = [
  { href: '/admin', label: 'Panel General', icon: Home },
  { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { href: '/admin/lotes', label: 'Lotes', icon: MapPin },
  { href: '/admin/etapas', label: 'Etapas', icon: Layers },
  { href: '/admin/compras', label: 'Compras', icon: CreditCard },
  { href: '/admin/pagos', label: 'Pagos', icon: FileText },
  { href: '/admin/pqrs', label: 'PQRS', icon: MessageSquare },
  { href: '/admin/planos', label: 'Planos', icon: FileImage },
]

export function AdminSidebar({ user, open = false, collapsed = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  const handleLinkClick = () => {
    if (onClose) onClose()
  }

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex h-screen w-64 transform flex-col border-r border-sidebar-border bg-sidebar shadow-lg transition-transform duration-300',
        // móvil: controlado por `open`
        open ? 'translate-x-0' : '-translate-x-full',
        // escritorio: visible por defecto, se colapsa con `collapsed`
        collapsed ? 'md:-translate-x-full' : 'md:translate-x-0'
      )}
      aria-label="Barra lateral de navegación"
    >
      {/* Brand */}
      <div className="flex items-center gap-2 border-b border-sidebar-border px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Building2 className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <div>
          <span className="text-lg font-bold text-sidebar-foreground">InmoGestion</span>
          <p className="text-[10px] font-medium uppercase tracking-wider text-sidebar-foreground/50">Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={handleLinkClick}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent font-semibold text-sidebar-accent-foreground before:absolute before:left-0 before:top-1/2 before:h-5 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-sidebar-primary'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  )}
                >
                  <link.icon className={cn('h-4 w-4 shrink-0', isActive && 'text-sidebar-primary')} />
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User + logout */}
      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sm font-semibold text-sidebar-accent-foreground">
            {user.nombre[0]}
            {user.apellido[0]}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user.nombre} {user.apellido}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/60">{user.email}</p>
          </div>
        </div>
        <form action={logoutAction}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesion
          </Button>
        </form>
      </div>
    </aside>
  )
}
