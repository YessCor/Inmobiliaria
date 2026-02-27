import { getDb } from '@/lib/db'
import { formatCurrency, formatDate, getEstadoLabel, getEstadoColor } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CrearCompraDialog } from '@/components/admin/crear-compra-dialog'

export default async function AdminComprasPage() {
  const sql = getDb()
  const [compras, clientes, lotes] = await Promise.all([
    sql`
      SELECT c.*, u.nombre, u.apellido, l.codigo as lote_codigo,
        (SELECT COALESCE(SUM(monto), 0) FROM pagos WHERE compra_id = c.id AND estado = 'aprobado') as total_pagado,
        (SELECT COALESCE(COUNT(*), 0) FROM pagos WHERE compra_id = c.id AND estado = 'aprobado' AND tipo = 'cuota_normal') as cuotas_pagadas,
        (SELECT COALESCE(COUNT(*), 0) FROM pagos WHERE compra_id = c.id AND estado = 'aprobado' AND tipo = 'cuota_inicial') as cuota_inicial_pagada
      FROM compras c
      JOIN usuarios u ON c.cliente_id = u.id
      JOIN lotes l ON c.lote_id = l.id
      ORDER BY c.created_at DESC
    `,
    sql`SELECT id, nombre, apellido, email FROM usuarios WHERE rol = 'cliente' ORDER BY nombre ASC`,
    sql`SELECT l.id, l.codigo, p.valor as valor FROM lotes l LEFT JOIN planos p ON l.plano_id = p.id WHERE l.estado = 'disponible' ORDER BY l.codigo ASC`,
  ])

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compras</h1>
          <p className="text-muted-foreground">Gestiona las compras de lotes.</p>
        </div>
        <CrearCompraDialog clientes={clientes} lotes={lotes} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Cuota Inicial</TableHead>
                <TableHead>Cuotas</TableHead>
                <TableHead>Cuotas restantes</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Historial</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {compras.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.nombre} {c.apellido}</TableCell>
                  <TableCell>{c.lote_codigo}</TableCell>
                  <TableCell>{formatCurrency(Number(c.valor_total))}</TableCell>
                  <TableCell>{formatCurrency(Number(c.cuota_inicial))}</TableCell>
                  <TableCell>{c.num_cuotas} x {formatCurrency(Number(c.valor_cuota))}</TableCell>
                  <TableCell>{(() => {
                    const valorCuota = Number(c.valor_cuota) || 0
                    const saldo = Number(c.saldo_pendiente) || 0
                    const inicialPagada = Number(c.cuota_inicial_pagada) > 0
                    
                    // Si no se ha pagado la cuota inicial, mostrar que falta la inicial + las cuotas
                    if (!inicialPagada) {
                      if (valorCuota <= 0) return '1 inicial + ' + c.num_cuotas
                      return '1 inicial + ' + c.num_cuotas + ' cuotas'
                    }
                    
                    // Si ya se pagó la inicial, calcular cuotas mensuales restantes
                    if (valorCuota <= 0) return 0
                    return Math.max(Math.ceil(saldo / valorCuota), 0)
                  })()}</TableCell>
                  <TableCell>{formatCurrency(Number(c.saldo_pendiente))}</TableCell>
                  <TableCell>
                    <Badge className={getEstadoColor(c.estado)}>{getEstadoLabel(c.estado)}</Badge>
                  </TableCell>
                  <TableCell>
                    {c.id ? (
                      <a href={`/admin/compras/${String(c.id)}/pagos`} className="text-sm text-primary hover:underline">Ver pagos</a>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
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
