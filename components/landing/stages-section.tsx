import { getDb } from '@/lib/db'
import { CheckCircle2, Circle, Clock } from 'lucide-react'

export async function StagesSection() {
  const sql = getDb()
  const etapas = (await sql`SELECT * FROM etapas ORDER BY orden ASC`) as Array<{
    id: number
    nombre: string
    descripcion: string
    orden: number
    activa: boolean
  }>

  const activeIndex = etapas.findIndex((e) => e.activa)

  return (
    <section id="etapas" className="bg-background py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <span className="mb-3 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Proceso
          </span>
          <h2 className="mb-3 text-balance text-3xl font-bold text-foreground md:text-4xl">
            Etapas del Proyecto
          </h2>
          <p className="mx-auto max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            Nuestro proyecto avanza de forma planificada, garantizando calidad en cada fase del
            desarrollo urbanístico.
          </p>
        </div>

        {etapas.length === 0 ? (
          <p className="text-center text-muted-foreground">Aún no hay etapas publicadas.</p>
        ) : (
          <div className="relative">
            {/* Rail de la línea de tiempo */}
            <div className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" />

            <div className="flex flex-col gap-6 md:gap-10">
              {etapas.map((etapa, index) => {
                const isActive = etapa.activa
                const isPast = activeIndex !== -1 && index < activeIndex
                const alignRight = index % 2 === 0

                return (
                  <div key={etapa.id} className="relative pl-10 md:pl-0">
                    {/* Punto en el rail */}
                    <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background ring-4 ring-background md:left-1/2 md:-translate-x-1/2">
                      {isPast ? (
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      ) : isActive ? (
                        <span className="relative flex h-6 w-6 items-center justify-center">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40" />
                          <Clock className="relative h-6 w-6 text-primary" />
                        </span>
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground/40" />
                      )}
                    </div>

                    {/* Tarjeta */}
                    <div
                      className={`md:w-1/2 ${alignRight ? 'md:pr-12' : 'md:ml-auto md:pl-12'}`}
                    >
                      <div
                        className={`rounded-xl border p-6 transition-colors ${
                          isActive
                            ? 'border-primary/60 bg-primary/5 shadow-sm'
                            : 'border-border bg-card'
                        } ${alignRight ? 'md:text-right' : ''}`}
                      >
                        <div
                          className={`mb-1.5 text-xs font-semibold uppercase tracking-wider ${
                            isActive ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        >
                          Etapa {etapa.orden}
                          {isActive && ' · En curso'}
                          {isPast && ' · Completada'}
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                          {etapa.nombre}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {etapa.descripcion}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
