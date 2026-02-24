import { getDb } from '@/lib/db'
import { formatDate } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileImage } from 'lucide-react'
import { CrearPlanoDialog } from '@/components/admin/crear-plano-dialog'
import { EditarPlanoDialog } from '@/components/admin/editar-plano-dialog'
import { EliminarPlanoButton } from '@/components/admin/eliminar-plano-button'

export default async function AdminPlanosPage() {
  const sql = getDb()
  const planos = await sql`SELECT * FROM planos ORDER BY created_at DESC`

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Planos</h1>
          <p className="text-muted-foreground">Consulta los planos de vivienda disponibles.</p>
        </div>
        <CrearPlanoDialog />
      </div>

      {planos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No hay planos registrados.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {planos.map((plano) => (
            <Card key={plano.id} className="overflow-hidden">
              <div className="relative h-48 bg-muted">
                {plano.imagen_url ? (
                  <img src={plano.imagen_url} alt={plano.nombre} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <FileImage className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{plano.nombre}</CardTitle>
              </CardHeader>
              <CardContent>
                {plano.descripcion && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{plano.descripcion}</p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">Creado: {formatDate(plano.created_at)}</p>
                <div className="mt-3 flex items-center gap-2">
                  <EditarPlanoDialog plano={plano as any} />
                  <EliminarPlanoButton planoId={plano.id} planoNombre={plano.nombre} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
