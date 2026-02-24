"use client"

import { useSearchParams } from 'next/navigation'
import { useActionState } from 'react'
import { startTransition, useEffect } from 'react'
import verifyAction from '@/lib/actions/verify'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

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

  if (state?.success) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-7 w-7 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Cuenta verificada</CardTitle>
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

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-foreground">Verificando...</CardTitle>
        <CardDescription>Espere mientras verificamos su correo.</CardDescription>
      </CardHeader>
      <CardContent>
        {state?.error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{state.error}</div>
        )}
        <div className="mt-4 text-center">
          <Link href="/login">
            <Button variant="outline">Volver a iniciar sesion</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
