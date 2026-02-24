 'use client'

import { useActionState, useState } from 'react'
import { actualizarPlanoAction } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle2, Loader2, Pencil } from 'lucide-react'

interface Props {
  plano: {
    id: number
    nombre: string
    descripcion: string | null
    imagen_url: string | null
    num_cuartos?: number
    banos?: number
    parqueaderos?: number
    /* pisos removed */
  }
}

export function EditarPlanoDialog({ plano }: Props) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(actualizarPlanoAction, null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="h-4 w-4" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Plano</DialogTitle>
          <DialogDescription>Modifica el plano {plano.nombre}.</DialogDescription>
        </DialogHeader>
        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="id" value={plano.id} />
          {state?.error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />{state.error}
            </div>
          )}
          {state?.success && (
            <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2.5 text-sm text-accent-foreground">
              <CheckCircle2 className="h-4 w-4 shrink-0" />Plano actualizado.
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" name="nombre" defaultValue={plano.nombre} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="num_cuartos">Cuartos</Label>
              <Input id="num_cuartos" name="num_cuartos" type="number" min="0" defaultValue={String(plano.num_cuartos ?? 0)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="banos">Baños</Label>
              <Input id="banos" name="banos" type="number" min="0" defaultValue={String(plano.banos ?? 0)} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="parqueaderos">Parqueaderos</Label>
            <Input id="parqueaderos" name="parqueaderos" type="number" min="0" defaultValue={String(plano.parqueaderos ?? 0)} />
          </div>

          <div className="flex flex-col gap-2">
            {/* 'pisos' removed per DB schema */}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="imagen_url">URL Imagen (opcional)</Label>
            <Input id="imagen_url" name="imagen_url" type="url" defaultValue={plano.imagen_url ?? ''} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="descripcion">Descripcion</Label>
            <Textarea id="descripcion" name="descripcion" rows={3} defaultValue={plano.descripcion ?? ''} />
          </div>

          <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Actualizar Plano
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
