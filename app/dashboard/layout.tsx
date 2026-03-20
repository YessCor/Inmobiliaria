import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
<<<<<<< HEAD
    <div className="flex min-h-screen relative">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/fondo.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.7,
        }}
      />
      <div className="relative z-10 flex min-h-screen bg-black/30">
      <DashboardSidebar user={session} />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          {children}
        </div>
      </main>
      </div>
    </div>
=======
    <DashboardShell user={session}>
      {children}
    </DashboardShell>
>>>>>>> 162c1c3c0956fd4cc433c881d41e1dc676fff19b
  )
}
