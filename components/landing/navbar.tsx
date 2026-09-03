'use client'

import * as React from 'react'
import Link from 'next/link'
import { Building2, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const navLinks = [
  { href: '#etapas', label: 'Etapas' },
  { href: '#lotes', label: 'Lotes' },
  { href: '#contacto', label: 'Contacto' },
]

export function Navbar() {
  const [open, setOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      {/* pr-16: deja espacio para el botón flotante de tema (fixed top-right) */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 py-3.5 pl-6 pr-16">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">InmoGestion</span>
        </Link>

        {/* Enlaces — escritorio */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Acciones — escritorio */}
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Iniciar sesion
            </Button>
          </Link>
          <Link href="/registro">
            <Button size="sm">Registrate</Button>
          </Link>
        </div>

        {/* Menú — móvil */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Abrir menú de navegación">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 gap-0">
              <SheetTitle className="px-4 pb-2 pt-5 pr-10 text-base">Navegación</SheetTitle>
              <SheetDescription className="sr-only">
                Enlaces de navegación y acceso a la plataforma
              </SheetDescription>

              <nav className="flex flex-col gap-1 px-2 py-2">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <a
                      href={link.href}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
                <SheetClose asChild>
                  <Link href="/login" className="w-full">
                    <Button variant="outline" className="w-full">
                      Iniciar sesion
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/registro" className="w-full">
                    <Button className="w-full">Registrate</Button>
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
