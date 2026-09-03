'use client'

import { useActionState } from 'react'
import { resetPasswordAction } from '@/lib/actions/password-recovery'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthLayout } from '@/components/auth/auth-layout'
import Link from 'next/link'
import { KeyRound, CheckCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ResetForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const [state, formAction, pending] = useActionState(resetPasswordAction, null)

  if (state?.success) {
    return (
      <Card className="w-full max-w-md border-white/10 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Contraseña Restablecida</CardTitle>
          <CardDescription>
            Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login">
            <Button className="w-full">Iniciar Sesión</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  if (!token) {
    return (
      <Card className="w-full max-w-md border-white/10 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Enlace Inválido</CardTitle>
          <CardDescription>
            El enlace de recuperación no es válido. Solicita uno nuevo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/recuperar">
            <Button variant="outline" className="w-full">
              Solicitar nuevo enlace
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md border-white/10 shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <KeyRound className="h-7 w-7 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Nueva Contraseña</CardTitle>
        <CardDescription>Ingresa tu nueva contraseña</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="token" value={token} />
          {state?.error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Nueva contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              required
            />
          </div>
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Guardando...' : 'Restablecer Contraseña'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function RestablecerPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div className="text-white/80">Cargando...</div>}>
        <ResetForm />
      </Suspense>
    </AuthLayout>
  )
}
