import { Suspense } from 'react'
import VerifyForm from '@/components/auth/verify-form'
import { verifyToken } from '@/lib/actions/verify'
import { redirect } from 'next/navigation'

export default async function VerifyPage({ searchParams }: { searchParams?: { token?: string } }) {
  const token = searchParams?.token
  if (token) {
    const result = await verifyToken(token)
    if (result.success) {
      redirect('/dashboard')
    }
    // else render client form which can display error
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Suspense fallback={<div className="text-muted-foreground">Cargando...</div>}>
        <VerifyForm />
      </Suspense>
    </div>
  )
}
