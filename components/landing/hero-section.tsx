import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, MapPin, Shield, TrendingUp } from 'lucide-react'

const stats = [
  { icon: MapPin, label: 'Lotes disponibles', value: '10+' },
  { icon: Shield, label: 'Escrituras al día', value: '100%' },
  { icon: TrendingUp, label: 'Valorización anual', value: '12%' },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0 -z-10">
        <img src="/images/hero-bg.jpg" alt="" className="h-full w-full object-cover" />
        {/* Overlay fijo (independiente del tema) para legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-black/55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(14,167,92,0.25),transparent_55%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 md:py-36">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5" />
            Proyecto residencial exclusivo
          </div>

          <h1 className="mb-6 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
            Tu lote ideal para construir el hogar de tus sueños
          </h1>

          <p className="mb-8 max-w-lg text-pretty text-lg leading-relaxed text-white/80">
            Lotes residenciales desde 100m² en un proyecto urbanístico planificado con
            zonas verdes, vías pavimentadas y todos los servicios.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/registro">
              <Button size="lg" className="w-full gap-2 sm:w-auto">
                Comenzar ahora
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#lotes">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/30 bg-white/5 text-white backdrop-blur-sm hover:bg-white/15 hover:text-white sm:w-auto"
              >
                Ver lotes disponibles
              </Button>
            </a>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
                <stat.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
