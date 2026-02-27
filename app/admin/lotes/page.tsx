import { getDb } from '@/lib/db'
import { formatCurrency, getEstadoLabel, getEstadoColor } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CrearLoteDialog } from '@/components/admin/crear-lote-dialog'
import { EditarLoteDialog } from '@/components/admin/editar-lote-dialog'
import { EliminarLoteButton } from '@/components/admin/eliminar-lote-button'
import { LoteEstadoSelect } from '@/components/admin/lote-estado-select'

export default async function AdminLotesPage() {
  const sql = getDb()
  const [lotes, etapas, planos] = await Promise.all([
    sql`SELECT l.*, e.nombre as etapa_nombre, p.id as plano_id, p.nombre as plano_nombre, p.area_m2 as plano_area_m2, p.valor as plano_valor, p.cuartos as plano_cuartos, p.banos as plano_banos, p.parqueaderos as plano_parqueaderos FROM lotes l LEFT JOIN etapas e ON l.etapa_id = e.id LEFT JOIN planos p ON l.plano_id = p.id ORDER BY l.codigo ASC`,
    sql`SELECT id, nombre FROM etapas ORDER BY orden ASC`,
    sql`SELECT id, nombre, cuartos, banos, parqueaderos, area_m2, valor FROM planos ORDER BY created_at DESC`,
  ])

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lotes</h1>
          <p className="text-muted-foreground">Gestiona los lotes del proyecto.</p>
        </div>
        <CrearLoteDialog etapas={etapas as any} planos={planos as any} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Codigo</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Cuartos</TableHead>
                <TableHead>Baños</TableHead>
                <TableHead>Parqueaderos</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Etapa</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lotes.map((lote) => (
                <TableRow key={lote.id}>
                  <TableCell className="font-medium">{lote.codigo}</TableCell>
                  <TableCell>{Number(lote.plano_area_m2 ?? lote.area_m2 ?? 0)} m2</TableCell>
                  <TableCell>{lote.plano_cuartos ?? lote.cuartos ?? '-'}</TableCell>
                  <TableCell>{lote.plano_banos ?? lote.banos ?? '-'}</TableCell>
                  <TableCell>{lote.plano_parqueaderos ?? lote.parqueaderos ?? '-'}</TableCell>
                  <TableCell>{formatCurrency(Number(lote.plano_valor ?? lote.valor ?? 0))}</TableCell>
                  <TableCell>{lote.etapa_nombre || '-'}</TableCell>
                  <TableCell>
                    <LoteEstadoSelect loteId={lote.id} currentEstado={lote.estado} />
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <EditarLoteDialog lote={lote as any} etapas={etapas as any} planos={planos as any} />
                    <EliminarLoteButton loteId={lote.id} loteCodigo={lote.codigo} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
