import { StagesSection } from '@/components/landing/stages-section'

export default async function DashboardEtapasPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Etapas</h1>
        <p className="text-muted-foreground">Conoce las etapas del proyecto.</p>
      </div>
      {/* Reuse landing stages component */}
      <StagesSection />
    </div>
  )
}
