import Link from 'next/link'
import { Home } from 'lucide-react'

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Fondo con la marca */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/portada-inmobiliaria.jpg"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b3b2b]/95 via-[#0b3b2b]/88 to-[#0e5a38]/82" />
      </div>

      {/* Volver al inicio */}
      <Link
        href="/"
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <Home className="h-4 w-4" />
        Inicio
      </Link>

      {children}
    </div>
  )
}
