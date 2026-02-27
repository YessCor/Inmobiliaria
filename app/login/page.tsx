import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
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
      <LoginForm />
    </div>
  )
}
