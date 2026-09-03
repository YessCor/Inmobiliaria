import { Suspense } from 'react'
import VerifyForm from '@/components/auth/verify-form'
import { AuthLayout } from '@/components/auth/auth-layout'
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
    <AuthLayout>
      <Suspense fallback={<div className="text-white/80">Cargando...</div>}>
        <VerifyForm />
      </Suspense>
    </AuthLayout>
  )
}
