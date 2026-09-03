import { getDb } from '@/lib/db'
import { formatCurrency } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BedDouble, MapPin, Maximize2 } from 'lucide-react'
import Link from 'next/link'

export async function LotsSection() {
  const sql = getDb()
  const lotes = await sql`
    SELECT l.*, e.nombre as etapa_nombre, p.valor as plano_valor, p.area_m2 as plano_area_m2, p.cuartos as plano_cuartos
    FROM lotes l
    LEFT JOIN etapas e ON l.etapa_id = e.id
    LEFT JOIN planos p ON l.plano_id = p.id
    WHERE l.estado = 'disponible'
    ORDER BY l.codigo ASC
    LIMIT 6
  `

  return (
    <section id="lotes" className="bg-secondary/40 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <span className="mb-3 inline-block rounded-full bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Disponibilidad
          </span>
          <h2 className="mb-3 text-balance text-3xl font-bold text-foreground md:text-4xl">
            Lotes Disponibles
          </h2>
          <p className="mx-auto max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            Encuentra el lote perfecto para tu proyecto. Todos los lotes cuentan con servicios
            públicos y vías de acceso.
          </p>
        </div>

        {lotes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
            <MapPin className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
            <p className="text-muted-foreground">No hay lotes disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lotes.map((lote) => {
              const area = Number(lote.plano_area_m2 ?? lote.area_m2 ?? 0)
              const precio = Number(lote.plano_valor ?? lote.valor ?? 0)
              const cuartos = Number(lote.plano_cuartos ?? 0)
              return (
                <Card key={lote.id} className="group gap-0 overflow-hidden py-0">
                  <div className="relative h-48 overflow-hidden bg-muted">
                    {lote.imagen_url ? (
                      <img
                        src={lote.imagen_url}
                        alt={`Lote ${lote.codigo}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <MapPin className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                    <Badge className="absolute right-3 top-3 border-transparent bg-primary text-primary-foreground shadow-sm">
                      Disponible
                    </Badge>
                  </div>

                  <CardHeader className="gap-0 pt-5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-lg font-semibold text-card-foreground">
                        Lote {lote.codigo}
                      </h3>
                      {lote.etapa_nombre && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {lote.etapa_nombre}
                        </span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-3">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Maximize2 className="h-4 w-4" />
                        {area > 0 ? `${area} m²` : '—'}
                      </span>
                      {cuartos > 0 && (
                        <span className="flex items-center gap-1.5">
                          <BedDouble className="h-4 w-4" />
                          {cuartos} {cuartos === 1 ? 'cuarto' : 'cuartos'}
                        </span>
                      )}
                      {lote.ubicacion && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {lote.ubicacion}
                        </span>
                      )}
                    </div>
                    <p className="mt-4 text-2xl font-bold text-foreground">
                      {precio > 0 ? formatCurrency(precio) : 'Consultar'}
                    </p>
                  </CardContent>

                  <CardFooter className="pb-5 pt-2">
                    <Link href="/registro" className="w-full">
                      <Button className="w-full">Me interesa</Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
