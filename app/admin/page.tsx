import { getDb } from '@/lib/db'
import { formatCurrency } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, FileText, MapPin, MessageSquare, Users } from 'lucide-react'

export default async function AdminPage() {
  const sql = getDb()

  const [usuarios, lotes, compras, pagos, pqrs] = await Promise.all([
    sql`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE rol = 'cliente') as clientes FROM usuarios`,
    sql`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE estado = 'disponible') as disponibles, COUNT(*) FILTER (WHERE estado = 'vendido') as vendidos FROM lotes`,
    sql`SELECT COUNT(*) as total, COALESCE(SUM(valor_total), 0) as valor_total FROM compras`,
    sql`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE estado = 'pendiente') as pendientes, COALESCE(SUM(monto) FILTER (WHERE estado = 'aprobado'), 0) as recaudado FROM pagos`,
    sql`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE estado = 'pendiente') as pendientes FROM pqrs`,
  ])

  const stats = [
    { label: 'Usuarios', value: usuarios[0].total, detail: `${usuarios[0].clientes} clientes`, icon: Users },
    { label: 'Lotes', value: lotes[0].total, detail: `${lotes[0].disponibles} disponibles`, icon: MapPin },
    { label: 'Compras', value: compras[0].total, detail: formatCurrency(Number(compras[0].valor_total)), icon: CreditCard },
    { label: 'Pagos', value: pagos[0].total, detail: `${pagos[0].pendientes} pendientes`, icon: FileText },
    { label: 'PQRS', value: pqrs[0].total, detail: `${pqrs[0].pendientes} pendientes`, icon: MessageSquare },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Panel de Administración</h1>
        <p className="text-muted-foreground">Resumen general del sistema inmobiliario.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="gap-0">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <stat.icon className="h-4 w-4" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{stat.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent activity */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentPayments />
        <RecentPqrs />
      </div>
    </div>
  )
}

async function RecentPayments() {
  const sql = getDb()
  const pagos = await sql`
    SELECT p.*, u.nombre, u.apellido, l.codigo as lote_codigo
    FROM pagos p
    JOIN compras c ON p.compra_id = c.id
    JOIN usuarios u ON c.cliente_id = u.id
    JOIN lotes l ON c.lote_id = l.id
    ORDER BY p.created_at DESC LIMIT 5
  `

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pagos Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {pagos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin pagos recientes.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {pagos.map((pago) => (
              <div key={pago.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/40">
                <div>
                  <p className="text-sm font-medium text-foreground">{pago.nombre} {pago.apellido}</p>
                  <p className="text-xs text-muted-foreground">Lote {pago.lote_codigo}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{formatCurrency(Number(pago.monto))}</p>
                  <p className={`text-xs capitalize ${pago.estado === 'aprobado' ? 'text-primary' : pago.estado === 'pendiente' ? 'text-amber-600 dark:text-amber-500' : 'text-destructive'}`}>
                    {pago.estado}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

async function RecentPqrs() {
  const sql = getDb()
  const items = await sql`
    SELECT pq.*, u.nombre, u.apellido
    FROM pqrs pq
    JOIN usuarios u ON pq.cliente_id = u.id
    ORDER BY pq.created_at DESC LIMIT 5
  `

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">PQRS Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin PQRS recientes.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/40">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.asunto}</p>
                  <p className="text-xs text-muted-foreground">{item.nombre} {item.apellido} - {item.tipo}</p>
                </div>
                <span className={`text-xs capitalize ${item.estado === 'pendiente' ? 'text-amber-600 dark:text-amber-500' : item.estado === 'resuelto' ? 'text-primary' : 'text-muted-foreground'}`}>
                  {item.estado}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
