import { getSession } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { redirect } from 'next/navigation'
import { formatDate, getEstadoLabel, getEstadoColor, getPqrsTypeLabel } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PqrsForm } from '@/components/dashboard/pqrs-form'
import PqrsCard from '@/components/dashboard/pqrs-card'

export default async function PqrsPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  const sql = getDb()
  const userId = Number(session.userId)
  if (Number.isNaN(userId)) redirect('/login')
  const pqrs = (await sql`
    SELECT * FROM pqrs WHERE cliente_id = ${userId} ORDER BY created_at DESC
  `) as Array<{
    id: number
    cliente_id: number
    tipo: string
    asunto: string
    descripcion: string
    estado: string
    created_at: string
  }>

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">PQRS</h1>
        <p className="text-muted-foreground">Peticiones, Quejas, Reclamos y Sugerencias.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <PqrsForm />
        </div>

        <div className="lg:col-span-2">
          <div className="flex flex-col gap-4">
            {pqrs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No has creado PQRS aun.</p>
                </CardContent>
              </Card>
            ) : (
              pqrs.map((item) => (
                <PqrsCard key={item.id} item={item} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
