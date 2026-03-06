import { getSession } from '@/lib/auth'
import { getDb } from '@/lib/db'
import { redirect } from 'next/navigation'
import { PerfilForm } from '@/components/dashboard/perfil-form'

export default async function PerfilPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const sql = getDb()
  const userId = Number(session.userId)
  if (Number.isNaN(userId)) redirect('/login')
  const users = (await sql`SELECT nombre, apellido, email, telefono, created_at, verificado FROM usuarios WHERE id = ${userId}`) as Array<{
    nombre: string
    apellido: string
    email: string
    telefono: string | null
    created_at: string
    verificado: boolean
  }>

  if (users.length === 0) redirect('/login')
  const user = users[0]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Mi Perfil</h1>
        <p className="text-muted-foreground">Actualiza tu informacion personal.</p>
      </div>

      <PerfilForm user={user} />
    </div>
  )
}
