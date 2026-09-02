import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'InmoGestión - Sistema Inmobiliario',
  description: 'Plataforma integral de gestión inmobiliaria para la venta y administración de lotes residenciales.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icono.png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icono.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0ea75c',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeToggle />
          {children}
          <Toaster richColors position="top-right" />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
