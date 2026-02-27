'use server'

import { getDb } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { sendPaymentApprovedEmail, sendPaymentRejectedEmail } from '@/lib/email'
import { formatCurrency } from '@/lib/format'

async function requireAdmin() {
  const session = await getSession()
  if (!session || session.rol !== 'admin') throw new Error('No autorizado')
  return session
}

// --- Lot management ---
const loteSchema = z.object({
  codigo: z.string().min(1),
  area_m2: z.coerce.number().positive(),
  ubicacion: z.string().nullish(), // Acepta null, undefined o string
  valor: z.coerce.number().positive(),
  estado: z.enum(['disponible', 'reservado', 'vendido']),
  etapa_id: z.coerce.number().nullable().optional(),
  descripcion: z.string().nullish(),
  // Estos pueden provenir de un `plano` seleccionado al crear/editar lote
  cuartos: z.coerce.number().min(0),
  banos: z.coerce.number().min(0),
  parqueaderos: z.coerce.number().min(0),
  plano_id: z.coerce.number().nullable().optional(),
  imagen_url: z.string().nullish(),
})

const loteUpdateSchema = z.object({
  codigo: z.string().min(1),
  area_m2: z.coerce.number().positive(),
  ubicacion: z.string().nullish(),
  valor: z.coerce.number().positive(),
  etapa_id: z.coerce.number().nullable().optional(),
  descripcion: z.string().nullish(),
  cuartos: z.coerce.number().min(0),
  banos: z.coerce.number().min(0),
  parqueaderos: z.coerce.number().min(0),
  plano_id: z.coerce.number().nullable().optional(),
  imagen_url: z.string().nullish(),
})

// Helper to convert empty strings to undefined, never null
const getOptionalString = (value: FormDataEntryValue | null): string | undefined => {
  if (!value) return undefined
  const str = String(value).trim()
  return str.length > 0 ? str : undefined
}

export async function crearLoteAction(_prevState: unknown, formData: FormData) {
  await requireAdmin()
  const raw = {
    codigo: formData.get('codigo'),
    area_m2: formData.get('area_m2'),
    ubicacion: getOptionalString(formData.get('ubicacion')),
    valor: formData.get('valor'),
    estado: formData.get('estado') || 'disponible',
    etapa_id: formData.get('etapa_id') === 'none' ? null : getOptionalString(formData.get('etapa_id')) ?? null,
    descripcion: getOptionalString(formData.get('descripcion')),
    // permitimos enviar un plano_id; si viene, se usará para poblar los campos
    cuartos: formData.get('cuartos') || 0,
    banos: formData.get('banos') || 0,
    parqueaderos: formData.get('parqueaderos') || 0,
    plano_id: formData.get('plano_id') || null,
    imagen_url: getOptionalString(formData.get('imagen_url')),
  }
  const parsed = loteSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const sql = getDb()
  // Si el usuario seleccionó un plano, obtener sus atributos y sobrescribir
  let finalCuartos = parsed.data.cuartos
  let finalBanos = parsed.data.banos
  let finalParqueaderos = parsed.data.parqueaderos
  if (parsed.data.plano_id) {
    const planos = await sql`SELECT cuartos, banos, parqueaderos FROM planos WHERE id = ${Number(parsed.data.plano_id)}`
    if (planos.length > 0) {
      finalCuartos = Number(planos[0].cuartos || 0)
      finalBanos = Number(planos[0].banos || 0)
      finalParqueaderos = Number(planos[0].parqueaderos || 0)
    }
  }
  try {
    await sql`
      INSERT INTO lotes (codigo, area_m2, ubicacion, valor, estado, etapa_id, descripcion, cuartos, banos, parqueaderos, plano_id, imagen_url)
      VALUES (${parsed.data.codigo}, ${parsed.data.area_m2}, ${parsed.data.ubicacion ?? null}, ${parsed.data.valor}, ${parsed.data.estado}, ${parsed.data.etapa_id}, ${parsed.data.descripcion ?? null}, ${finalCuartos}, ${finalBanos}, ${finalParqueaderos}, ${parsed.data.plano_id ?? null}, ${parsed.data.imagen_url ?? null})
    `
  } catch {
    return { error: 'El codigo de lote ya existe' }
  }

  revalidatePath('/admin/lotes')
  revalidatePath('/dashboard/lotes')
  return { success: true }
}

export async function actualizarLoteAction(_prevState: unknown, formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  const raw = {
    codigo: formData.get('codigo'),
    area_m2: formData.get('area_m2'),
    ubicacion: getOptionalString(formData.get('ubicacion')),
    valor: formData.get('valor'),
    etapa_id: formData.get('etapa_id') === 'none' ? null : getOptionalString(formData.get('etapa_id')) ?? null,
    descripcion: getOptionalString(formData.get('descripcion')),
    cuartos: formData.get('cuartos') || 0,
    banos: formData.get('banos') || 0,
    parqueaderos: formData.get('parqueaderos') || 0,
    plano_id: formData.get('plano_id') || null,
    imagen_url: getOptionalString(formData.get('imagen_url')),
  }
  const parsed = loteUpdateSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const sql = getDb()
  let finalCuartos = parsed.data.cuartos
  let finalBanos = parsed.data.banos
  let finalParqueaderos = parsed.data.parqueaderos
  if (parsed.data.plano_id) {
    const planos = await sql`SELECT cuartos, banos, parqueaderos FROM planos WHERE id = ${Number(parsed.data.plano_id)}`
    if (planos.length > 0) {
      finalCuartos = Number(planos[0].cuartos || 0)
      finalBanos = Number(planos[0].banos || 0)
      finalParqueaderos = Number(planos[0].parqueaderos || 0)
    }
  }
  try {
    await sql`
      UPDATE lotes
      SET area_m2 = ${parsed.data.area_m2}, ubicacion = ${parsed.data.ubicacion ?? null}, valor = ${parsed.data.valor},
          etapa_id = ${parsed.data.etapa_id}, descripcion = ${parsed.data.descripcion ?? null},
          cuartos = ${finalCuartos}, banos = ${finalBanos}, parqueaderos = ${finalParqueaderos},
          plano_id = ${parsed.data.plano_id ?? null}, imagen_url = ${parsed.data.imagen_url ?? null}, updated_at = NOW()
      WHERE id = ${Number(id)}
    `
  } catch (e) {
    console.error('Error al actualizar lote:', e)
    return { error: 'Error al actualizar el lote' }
  }

  revalidatePath('/admin/lotes')
  revalidatePath('/dashboard/lotes')
  return { success: true }
}

export async function actualizarLoteEstadoAction(loteId: number, estado: string) {
  await requireAdmin()
  const sql = getDb()
  await sql`UPDATE lotes SET estado = ${estado}, updated_at = NOW() WHERE id = ${loteId}`
  revalidatePath('/admin/lotes')
  revalidatePath('/admin/compras')
}

// --- Payment management ---
export async function aprobarPagoAction(pagoId: number) {
  await requireAdmin()
  const sql = getDb()

  // 1. Obtener el pago a aprobar
  const pagos = await sql`SELECT * FROM pagos WHERE id = ${pagoId}`
  if (pagos.length === 0) return

  const pago = pagos[0]

  // 2. Obtener la compra relacionada
  const compras = await sql`SELECT * FROM compras WHERE id = ${pago.compra_id}`
  if (compras.length === 0) return

  const compra = compras[0]
  const valorTotal = Number(compra.valor_total)
  const valorCuota = Number(compra.valor_cuota)
  const cuotaInicial = Number(compra.cuota_inicial)

  // 3. Calcular total pagado antes de este pago (solo aprobados)
  const pagosAnteriores = await sql`
    SELECT COALESCE(SUM(monto), 0) as total 
    FROM pagos 
    WHERE compra_id = ${compra.id} AND estado = 'aprobado' AND id != ${pagoId}
  `
  const totalPagadoAnterior = Number(pagosAnteriores[0].total)

  // 4. Calcular total après este pago
  const montoPago = Number(pago.monto)
  const totalPagadoNuevo = totalPagadoAnterior + montoPago

  // 5. Calcular nuevo saldo pendiente (nunca menor que 0)
  const nuevoSaldo = Math.max(0, valorTotal - totalPagadoNuevo)

  // 6. Calcular cuotas pagadas correctamente
  // Contar cuota inicial pagada
  const tieneCuotaInicialPagada = await sql`
    SELECT COUNT(*) as count 
    FROM pagos 
    WHERE compra_id = ${compra.id} AND estado = 'aprobado' AND tipo = 'cuota_inicial'
  `
  const cuotaInicialPagada = Number(tieneCuotaInicialPagada[0].count) > 0 || pago.tipo === 'cuota_inicial'

  // Contar cuotas normales pagadas (incluyendo las que puede cubrir el pago adicional)
  const cuotasNormalesAnteriores = await sql`
    SELECT COUNT(*) as count 
    FROM pagos 
    WHERE compra_id = ${compra.id} AND estado = 'aprobado' AND tipo = 'cuota_normal' AND id != ${pagoId}
  `
  let cuotasPagadas = Number(cuotasNormalesAnteriores[0].count)

  // Si el pago actual es una cuota normal, incrementamos el contador
  if (pago.tipo === 'cuota_normal') {
    cuotasPagadas += 1
  }

  // Si es un pago adicional, calcular cuántas cuotas cubre
  if (pago.tipo === 'adicional' && valorCuota > 0) {
    // Calcular cuánto queda después de la cuota inicial
    const saldoSinInicial = Math.max(0, valorTotal - cuotaInicial - totalPagadoAnterior)
    // Cuántas cuotas adicionales cubre el pago
    const cuotasCubiertas = Math.floor(montoPago / valorCuota)
    cuotasPagadas += cuotasCubiertas
  }

  // 7. Determinar estado de la compra
  // La compra está completa solo cuando totalPagado >= valorTotal
  const estaCompleta = totalPagadoNuevo >= valorTotal

  // 8. Actualizar el pago a aprobado
  await sql`UPDATE pagos SET estado = 'aprobado' WHERE id = ${pagoId}`

  // 9. Actualizar la compra con los valores correctos
  if (estaCompleta) {
    // Si está completamente pagada
    await sql`
      UPDATE compras 
      SET estado = 'completada', saldo_pendiente = 0 
      WHERE id = ${compra.id}
    `
    // Actualizar estado del lote
    await sql`UPDATE lotes SET estado = 'vendido' WHERE id = ${compra.lote_id}`
  } else {
    // Si no está completa, actualizar solo el saldo pendiente
    await sql`
      UPDATE compras 
      SET saldo_pendiente = ${nuevoSaldo} 
      WHERE id = ${compra.id}
    `
  }

  // 10. Enviar email de confirmación (si aplica)
  try {
    const usuarios = await sql`SELECT nombre, email FROM usuarios WHERE id = ${compra.cliente_id}`
    if (usuarios.length > 0) {
      const usuario = usuarios[0]
      await sendPaymentApprovedEmail(usuario.email, {
        nombre: usuario.nombre,
        monto: formatCurrency(montoPago),
        lote: String(compra.lote_id),
        fecha: new Date().toISOString(),
        tipo: pago.tipo || 'cuota_normal',
      })
    }
  } catch (e) {
    console.error('Error sending approved email:', e)
  }

  // 11. Revalidar paths
  revalidatePath('/admin/pagos')
  revalidatePath('/admin/compras')
  revalidatePath('/dashboard/pagos')
  revalidatePath('/dashboard/compras')
  revalidatePath('/dashboard/lotes')
}

export async function rechazarPagoAction(pagoId: number, motivo?: string) {
  await requireAdmin()
  const sql = getDb()

  // Validar que existe motivo
  if (!motivo || motivo.trim().length === 0) {
    return { error: 'El motivo del rechazo es obligatorio' }
  }

  // Obtener el pago antes de rechazarlo para enviar el correo
  const pagos = await sql`SELECT * FROM pagos WHERE id = ${pagoId}`
  if (pagos.length === 0) return { error: 'Pago no encontrado' }

  const pago = pagos[0]

  // Solo rechazar si está en estado pendiente
  if (pago.estado !== 'pendiente') {
    return { error: 'El pago ya fue procesado anteriormente' }
  }

  // Obtener información de la compra y el cliente para el correo
  const compras = await sql`SELECT c.*, l.codigo as lote_codigo, u.nombre, u.email FROM compras c JOIN lotes l ON c.lote_id = l.id JOIN usuarios u ON c.cliente_id = u.id WHERE c.id = ${pago.compra_id}`
  
  // Actualizar el estado del pago a rechazado
  await sql`UPDATE pagos SET estado = 'rechazado' WHERE id = ${pagoId}`

  // Enviar correo de rechazo al cliente
  if (compras.length > 0) {
    const compra = compras[0]
    try {
      await sendPaymentRejectedEmail(compra.email, {
        nombre: compra.nombre,
        monto: formatCurrency(Number(pago.monto)),
        lote: compra.lote_codigo,
        fecha: new Date(pago.fecha_pago).toISOString(),
        tipo: pago.tipo || 'cuota_normal',
        motivo: motivo.trim(),
      })
    } catch (e) {
      console.error('Error sending rejection email:', e)
    }
  }

  // Revalidar paths
  revalidatePath('/admin/pagos')
  revalidatePath('/dashboard/pagos')
  return { success: true }
}

// --- Purchase management ---
const compraSchema = z.object({
  cliente_id: z.coerce.number().positive(),
  lote_id: z.coerce.number().positive(),
  cuota_inicial: z.coerce.number().min(0),
  num_cuotas: z.coerce.number().min(1),
})

export async function crearCompraAction(_prevState: unknown, formData: FormData) {
  await requireAdmin()
  const raw = {
    cliente_id: formData.get('cliente_id'),
    lote_id: formData.get('lote_id'),
    cuota_inicial: formData.get('cuota_inicial'),
    num_cuotas: formData.get('num_cuotas'),
  }
  const parsed = compraSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const sql = getDb()
  const lotes = await sql`SELECT l.*, p.valor as plano_valor FROM lotes l LEFT JOIN planos p ON l.plano_id = p.id WHERE l.id = ${parsed.data.lote_id} AND l.estado = 'disponible'`
  if (lotes.length === 0) return { error: 'Lote no disponible' }

  const lote = lotes[0]
  const valorTotal = Number(lote.plano_valor ?? lote.valor ?? 0)
  const cuotaInicial = parsed.data.cuota_inicial
  const saldoPendiente = valorTotal - cuotaInicial
  const valorCuota = parsed.data.num_cuotas > 0 ? saldoPendiente / parsed.data.num_cuotas : 0

  await sql`
    INSERT INTO compras (cliente_id, lote_id, valor_total, cuota_inicial, num_cuotas, valor_cuota, saldo_pendiente, estado)
    VALUES (${parsed.data.cliente_id}, ${parsed.data.lote_id}, ${valorTotal}, ${cuotaInicial}, ${parsed.data.num_cuotas}, ${valorCuota}, ${saldoPendiente}, 'activa')
  `
  await sql`UPDATE lotes SET estado = 'reservado', updated_at = NOW() WHERE id = ${parsed.data.lote_id}`

  revalidatePath('/admin/compras')
  revalidatePath('/admin/lotes')
  return { success: true }
}

// --- PQRS management ---
export async function responderPqrsAction(_prevState: unknown, formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  const respuesta = formData.get('respuesta') as string
  const estado = formData.get('estado') as string

  if (!respuesta) return { error: 'La respuesta es requerida' }

  const sql = getDb()
  await sql`UPDATE pqrs SET respuesta = ${respuesta}, estado = ${estado || 'resuelto'}, updated_at = NOW() WHERE id = ${Number(id)}`

  revalidatePath('/admin/pqrs')
  return { success: true }
}

// --- User management ---
export async function crearUsuarioAction(_prevState: unknown, formData: FormData) {
  await requireAdmin()
  const nombre = formData.get('nombre') as string
  const apellido = formData.get('apellido') as string
  const email = formData.get('email') as string
  const telefono = formData.get('telefono') as string
  const password = formData.get('password') as string
  const rol = formData.get('rol') as string

  if (!nombre || !apellido || !email || !password) return { error: 'Todos los campos son requeridos' }

  const sql = getDb()
  const existing = await sql`SELECT id FROM usuarios WHERE email = ${email}`
  if (existing.length > 0) return { error: 'Ya existe un usuario con este email' }

  const passwordHash = await bcrypt.hash(password, 12)
  await sql`
    INSERT INTO usuarios (nombre, apellido, email, telefono, password_hash, rol, verificado)
    VALUES (${nombre}, ${apellido}, ${email}, ${telefono || null}, ${passwordHash}, ${rol || 'cliente'}, true)
  `

  revalidatePath('/admin/usuarios')
  return { success: true }
}

export async function actualizarUsuarioAction(_prevState: unknown, formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  const nombre = formData.get('nombre') as string
  const apellido = formData.get('apellido') as string
  const email = formData.get('email') as string
  const telefono = formData.get('telefono') as string
  const rol = formData.get('rol') as string
  const password = formData.get('password') as string

  if (!nombre || !apellido || !email) return { error: 'Todos los campos son requeridos' }

  const sql = getDb()
  
  // Check if email is already in use by another user
  const existing = await sql`SELECT id FROM usuarios WHERE email = ${email} AND id != ${Number(id)}`
  if (existing.length > 0) return { error: 'Ya existe un usuario con este email' }

  if (password) {
    // If password is provided, update it
    const passwordHash = await bcrypt.hash(password, 12)
    await sql`
      UPDATE usuarios 
      SET nombre = ${nombre}, apellido = ${apellido}, email = ${email}, telefono = ${telefono || null}, password_hash = ${passwordHash}
      WHERE id = ${Number(id)}
    `
  } else {
    // If no password, just update the other fields
    await sql`
      UPDATE usuarios 
      SET nombre = ${nombre}, apellido = ${apellido}, email = ${email}, telefono = ${telefono || null}, rol = ${rol}
      WHERE id = ${Number(id)}
    `
  }

  revalidatePath('/admin/usuarios')
  return { success: true }
}

// --- Stage management ---
export async function crearEtapaAction(_prevState: unknown, formData: FormData) {
  await requireAdmin()
  const nombre = formData.get('nombre') as string
  const descripcion = formData.get('descripcion') as string
  const orden = Number(formData.get('orden'))
  const activa = formData.get('activa') === 'on'

  if (!nombre) return { error: 'El nombre es requerido' }

  const sql = getDb()
  await sql`INSERT INTO etapas (nombre, descripcion, orden, activa) VALUES (${nombre}, ${descripcion || null}, ${orden || 0}, ${activa})`

  revalidatePath('/admin/etapas')
  return { success: true }
}

export async function toggleEtapaAction(id: number, activa: boolean) {
  await requireAdmin()
  const sql = getDb()
  await sql`UPDATE etapas SET activa = ${activa} WHERE id = ${id}`
  revalidatePath('/admin/etapas')
}

// --- Planos management ---
export async function crearPlanoAction(_prevState: unknown, formData: FormData) {
  await requireAdmin()
  const nombre = formData.get('nombre') as string
  const descripcion = formData.get('descripcion') as string
  const imagen_url = getOptionalString(formData.get('imagen_url'))
  const cuartos = Number(formData.get('cuartos') || 0)
  const banos = Number(formData.get('banos') || 0)
  const parqueaderos = Number(formData.get('parqueaderos') || 0)

  if (!nombre) return { error: 'El nombre es requerido' }

  const sql = getDb()
  await sql`INSERT INTO planos (nombre, descripcion, imagen_url, cuartos, banos, parqueaderos, created_at) VALUES (${nombre}, ${descripcion || null}, ${imagen_url ?? null}, ${cuartos}, ${banos}, ${parqueaderos}, NOW())`
  revalidatePath('/admin/planos')
  return { success: true }
}

export async function actualizarPlanoAction(_prevState: unknown, formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  const nombre = formData.get('nombre') as string
  const descripcion = formData.get('descripcion') as string
  const imagen_url = getOptionalString(formData.get('imagen_url'))
  const cuartos = Number(formData.get('cuartos') || 0)
  const banos = Number(formData.get('banos') || 0)
  const parqueaderos = Number(formData.get('parqueaderos') || 0)

  if (!nombre) return { error: 'El nombre es requerido' }
  const sql = getDb()
  try {
    await sql`UPDATE planos SET nombre = ${nombre}, descripcion = ${descripcion || null}, imagen_url = ${imagen_url ?? null}, cuartos = ${cuartos}, banos = ${banos}, parqueaderos = ${parqueaderos} WHERE id = ${id}`
  } catch (e) {
    console.error('Error al actualizar plano:', e)
    return { error: 'Error al actualizar el plano' }
  }
  revalidatePath('/admin/planos')
  return { success: true }
}

export async function eliminarPlanoAction(planoId: number) {
  await requireAdmin()
  const sql = getDb()
  // Prevent deleting if any lote references this plano
  const referencias = await sql`SELECT COUNT(*) as count FROM lotes WHERE plano_id = ${planoId}`
  if (referencias[0].count > 0) return { error: 'No puedes eliminar un plano que está en uso por lotes' }

  try {
    await sql`DELETE FROM planos WHERE id = ${planoId}`
    revalidatePath('/admin/planos')
    return { success: true }
  } catch (e) {
    console.error('Error al eliminar plano:', e)
    return { error: 'Error al eliminar el plano' }
  }
}
// --- Delete functions ---
export async function eliminarUsuarioAction(usuarioId: number) {
  await requireAdmin()
  const sql = getDb()
  
  // Prevent deleting if user has purchases
  const compras = await sql`SELECT COUNT(*) as count FROM compras WHERE cliente_id = ${usuarioId}`
  if (compras[0].count > 0) {
    return { error: 'No puedes eliminar un usuario que tiene compras o reservas' }
  }

  try {
    await sql`DELETE FROM usuarios WHERE id = ${usuarioId}`
    revalidatePath('/admin/usuarios')
    return { success: true }
  } catch {
    return { error: 'Error al eliminar el usuario' }
  }
}

export async function eliminarLoteAction(loteId: number) {
  await requireAdmin()
  const sql = getDb()
  
  // Prevent deleting if lot has purchases
  const compras = await sql`SELECT COUNT(*) as count FROM compras WHERE lote_id = ${loteId}`
  if (compras[0].count > 0) {
    return { error: 'No puedes eliminar un lote que tiene compras o reservas' }
  }

  try {
    await sql`DELETE FROM lotes WHERE id = ${loteId}`
    revalidatePath('/admin/lotes')
    revalidatePath('/dashboard/lotes')
    return { success: true }
  } catch {
    return { error: 'Error al eliminar el lote' }
  }
}