import { Building2, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      id="contacto"
      className="border-t border-black/10 bg-[#0b3b2b] text-white/80 dark:border-white/10 dark:bg-[#070d0a]"
    >
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Marca */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-white">InmoGestion</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              Sistema integral de gestión inmobiliaria para la venta y administración de lotes residenciales.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              Enlaces
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="#etapas" className="text-sm text-white/70 transition-colors hover:text-white">
                  Etapas del proyecto
                </a>
              </li>
              <li>
                <a href="#lotes" className="text-sm text-white/70 transition-colors hover:text-white">
                  Lotes disponibles
                </a>
              </li>
              <li>
                <Link href="/login" className="text-sm text-white/70 transition-colors hover:text-white">
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link href="/registro" className="text-sm text-white/70 transition-colors hover:text-white">
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              Contacto
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Phone className="h-4 w-4 shrink-0" />
                +57 (1) 234 5678
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Mail className="h-4 w-4 shrink-0" />
                contacto@inmogestion.com
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <MapPin className="h-4 w-4 shrink-0" />
                Bogotá, Colombia
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/50">
          © {year} InmoGestion. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
