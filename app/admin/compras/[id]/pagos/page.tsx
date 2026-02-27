import { getDb } from '@/lib/db'
import { formatCurrency, formatDate, getEstadoLabel, getEstadoColor } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PagoActions } from '@/components/admin/pago-actions'

interface Params {
  params: Promise<{ id: string }>
}

export default async function CompraPagosPage({ params }: Params) {
  const { id } = await params
  const compraId = Number(id)
  if (Number.isNaN(compraId)) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">ID de compra inválido</h1>
          <p className="text-muted-foreground">El identificador proporcionado no es válido.</p>
        </div>
      </div>
    )
  }
  const sql = getDb()

  const pagos = await sql`
    SELECT p.*, u.nombre, u.apellido, l.codigo as lote_codigo
    FROM pagos p
    JOIN compras c ON p.compra_id = c.id
    JOIN usuarios u ON c.cliente_id = u.id
    JOIN lotes l ON c.lote_id = l.id
    WHERE p.compra_id = ${compraId}
    ORDER BY p.created_at DESC
  `

  const compra = await sql`SELECT c.*, u.nombre, u.apellido, l.codigo as lote_codigo FROM compras c JOIN usuarios u ON c.cliente_id = u.id JOIN lotes l ON c.lote_id = l.id WHERE c.id = ${compraId}`

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Historial de pagos</h1>
        <p className="text-muted-foreground">Pagos registrados para la compra seleccionada.</p>
      </div>

      {compra.length > 0 && (
        <Card className="mb-6">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-medium">{compra[0].nombre} {compra[0].apellido}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lote</p>
                <p className="font-medium">{compra[0].lote_codigo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo pendiente</p>
                <p className="font-medium">{formatCurrency(Number(compra[0].saldo_pendiente))}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Metodo</TableHead>
                <TableHead>Referencia</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagos.map((pago: any) => (
                <TableRow key={pago.id}>
                  <TableCell>{formatDate(pago.fecha_pago)}</TableCell>
                  <TableCell>{formatCurrency(Number(pago.monto))}</TableCell>
                  <TableCell className="capitalize">{pago.tipo || 'cuota_normal'}</TableCell>
                  <TableCell className="capitalize">{pago.metodo_pago}</TableCell>
                  <TableCell>{pago.referencia || '-'}</TableCell>
                  <TableCell>
                    <Badge className={getEstadoColor(pago.estado)}>{getEstadoLabel(pago.estado)}</Badge>
                  </TableCell>
                  <TableCell>
                    {pago.estado === 'pendiente' && <PagoActions pagoId={pago.id} />}
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
