"use client"

import { useSearchParams } from 'next/navigation'
import { useActionState } from 'react'
import { startTransition, useEffect } from 'react'
import verifyAction from '@/lib/actions/verify'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'
import { CheckCircle, Loader2 } from 'lucide-react'

export default function VerifyForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const [state, action, pending] = useActionState(verifyAction, null)

  useEffect(() => {
    if (token && !state) {
      const form = new FormData()
      form.set('token', token)
      startTransition(() => {
        ;(action as any)(form)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (state && 'success' in state && state.success) {
    return (
      <Card className="w-full max-w-md border-white/10 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Cuenta verificada</CardTitle>
          <CardDescription>Tu correo ha sido verificado. Ya has sido autenticado.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard">
            <Button className="w-full">Ir al panel</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const hasError = Boolean(state?.error)

  return (
    <Card className="w-full max-w-md border-white/10 shadow-2xl">
      <CardHeader className="text-center">
        {!hasError && (
          <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-primary" />
        )}
        <CardTitle className="text-2xl font-bold">
          {hasError ? 'No pudimos verificar tu correo' : 'Verificando...'}
        </CardTitle>
        <CardDescription>
          {hasError
            ? 'El enlace puede haber expirado o ya fue utilizado.'
            : 'Espera mientras verificamos tu correo.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state?.error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {state.error}
          </div>
        )}
        <div className="mt-4 text-center">
          <Link href="/login">
            <Button variant="outline">Volver a iniciar sesión</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
