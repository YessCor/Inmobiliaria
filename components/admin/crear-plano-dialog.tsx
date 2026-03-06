 'use client'

import { useActionState, useState } from 'react'
import { crearPlanoAction } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle2, Loader2, Plus } from 'lucide-react'

export function CrearPlanoDialog() {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(crearPlanoAction, null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" />Nuevo Plano</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Plano</DialogTitle>
          <DialogDescription>Agrega un nuevo tipo de vivienda.</DialogDescription>
        </DialogHeader>
        <form action={action} className="flex flex-col gap-4">
          {state?.error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />{state.error}
            </div>
          )}
          {state?.success && (
            <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2.5 text-sm text-accent-foreground">
              <CheckCircle2 className="h-4 w-4 shrink-0" />Plano creado.
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" name="nombre" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="cuartos">Cuartos</Label>
              <Input id="cuartos" name="cuartos" type="number" min="0" defaultValue={0} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="banos">Baños</Label>
              <Input id="banos" name="banos" type="number" min="0" defaultValue="0" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="area_m2">Area (m2)</Label>
              <Input id="area_m2" name="area_m2" type="number" min="0" step="0.01" defaultValue={0} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="valor">Valor ($)</Label>
              <Input id="valor" name="valor" type="number" min="0" step="0.01" defaultValue={0} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="parqueaderos">Parqueaderos</Label>
            <Input id="parqueaderos" name="parqueaderos" type="number" min="0" defaultValue="0" />
          </div>

          <div className="flex flex-col gap-2">
            {/* 'pisos' removed per DB schema */}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="imagen_url">URL Imagen (opcional)</Label>
            <Input id="imagen_url" name="imagen_url" type="url" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="descripcion">Descripcion</Label>
            <Textarea id="descripcion" name="descripcion" rows={3} />
          </div>

          <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Crear Plano
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
