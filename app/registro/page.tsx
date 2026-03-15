import { RegisterForm } from '@/components/auth/register-form'
import Link from 'next/link'
import { Home } from 'lucide-react'

export default function RegistroPage() {
  return (
    <div
      style={{
        backgroundImage: "linear-gradient(rgba(6,128,50,0.85), rgba(6,128,50,0.85)), url('/images/portada-inmobiliaria.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
      className="flex items-center justify-center"
    >
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
      >
        <Home className="h-5 w-5" />
        <span className="text-sm font-medium">Inicio</span>
      </Link>
      <RegisterForm />
    </div>
  )
}
