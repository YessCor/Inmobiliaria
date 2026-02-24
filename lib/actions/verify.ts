"use server"

import { getDb } from '@/lib/db'
import { createSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const verifySchema = z.object({
  token: z.string().min(1, 'Token invalido'),
})

export async function verifyToken(token: string) {
  const parsed = verifySchema.safeParse({ token })
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const sql = getDb()
  const users = await sql`
    SELECT id, nombre, apellido, email, rol FROM usuarios
    WHERE token_verificacion = ${parsed.data.token} AND token_verificacion_expira > NOW()
  `

  if (users.length === 0) {
    return { error: 'El enlace de verificacion es invalido o ha expirado.' }
  }

  const user = users[0]

  await sql`
    UPDATE usuarios SET verificado = TRUE, token_verificacion = NULL, token_verificacion_expira = NULL, updated_at = NOW()
    WHERE id = ${user.id}
  `

  // Crear sesion e iniciar
  await createSession({
    userId: user.id,
    email: user.email,
    nombre: user.nombre,
    apellido: user.apellido,
    rol: user.rol,
  })

  return { success: true }
}

export async function verifyAction(_prevState: unknown, formData: FormData | null) {
  if (!formData) {
    return { error: 'Datos del formulario no proporcionados' }
  }

  const token = formData.get('token') as string | null
  if (!token) {
    return { error: 'Token faltante' }
  }

  return await verifyToken(token)
}

export default verifyAction
