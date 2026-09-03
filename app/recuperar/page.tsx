'use client'

import { useActionState } from 'react'
import { requestPasswordResetAction } from '@/lib/actions/password-recovery'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthLayout } from '@/components/auth/auth-layout'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function RecuperarPage() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, null)

  if (state?.success) {
    return (
      <AuthLayout>
        <Card className="w-full max-w-md border-white/10 shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Correo Enviado</CardTitle>
            <CardDescription>
              Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña.
              Revisa tu bandeja de entrada y spam.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio de sesión
              </Button>
            </Link>
          </CardContent>
        </Card>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md border-white/10 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Recuperar Contraseña</CardTitle>
          <CardDescription>
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            {state?.error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {state.error}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
            </div>
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </Button>
            <Link
              href="/login"
              className="text-center text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Volver al inicio de sesión
            </Link>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
