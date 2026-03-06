"use client"

import { useActionState, useEffect, useState } from 'react'
import { actualizarLoteAction } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, CheckCircle2, Loader2, Pencil } from 'lucide-react'

interface EditarLoteDialogProps {
  lote: {
    id: number
    codigo: string
    area_m2: number
    ubicacion: string | null
    valor: number
    estado: string
    etapa_id: number | null
    descripcion: string | null
    cuartos: number
    banos: number
    parqueaderos: number
    plano_id?: number | null
    imagen_url: string | null
  }
  etapas: Array<{ id: number; nombre: string }>
  planos?: Array<{ id: number; nombre: string; cuartos?: number; banos?: number; parqueaderos?: number; valor?: number; area_m2?: number }>
}

export function EditarLoteDialog({ lote, etapas, planos }: EditarLoteDialogProps) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(actualizarLoteAction, null)
  const [selectedPlano, setSelectedPlano] = useState<string>(lote.plano_id ? String(lote.plano_id) : 'none')
  const [area, setArea] = useState<number | ''>(lote.area_m2 ? Number(lote.area_m2) : '')
  const [valor, setValor] = useState<number | ''>(lote.valor ? Number(lote.valor) : '')

  useEffect(() => {
    if (!open) {
      setSelectedPlano(lote.plano_id ? String(lote.plano_id) : 'none')
      setArea(lote.area_m2 ? Number(lote.area_m2) : '')
      setValor(lote.valor ? Number(lote.valor) : '')
    }
  }, [open, lote.plano_id, lote.area_m2, lote.valor])

  const handlePlanoChange = (v: string) => {
    setSelectedPlano(v)
    if (v === 'none') {
      setArea(lote.area_m2 ? Number(lote.area_m2) : '')
      setValor(lote.valor ? Number(lote.valor) : '')
    } else {
      const p = (planos || []).find((pl) => String(pl.id) === v)
      if (!p) return
      if (typeof p.area_m2 !== 'undefined') setArea(Number(p.area_m2))
      if (typeof p.valor !== 'undefined') setValor(Number(p.valor))
    }
  }

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
          <DialogTitle>Editar Lote</DialogTitle>
          <DialogDescription>Modifica los datos del lote {lote.codigo}.</DialogDescription>
        </DialogHeader>
        <form action={action} className="flex flex-col gap-4">
          {state?.error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2.5 text-sm text-accent-foreground">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Lote actualizado exitosamente.
            </div>
          )}
          <input type="hidden" name="id" value={lote.id} />
          <input type="hidden" name="estado" value={lote.estado} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`codigo-${lote.id}`}>Codigo</Label>
              <Input id={`codigo-${lote.id}`} name="codigo" defaultValue={lote.codigo} required disabled />
              <input type="hidden" name="codigo" value={lote.codigo} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`area_m2-${lote.id}`}>Area (m2)</Label>
              <Input id={`area_m2-${lote.id}`} name="area_m2" type="number" min="1" step="0.01" defaultValue={undefined} value={area === '' ? '' : String(area)} onChange={(e) => setArea(e.target.value === '' ? '' : Number(e.target.value))} required disabled={selectedPlano !== 'none'} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`plano_id-${lote.id}`}>Plano (tipo de casa)</Label>
            <Select defaultValue={lote.plano_id ? String(lote.plano_id) : 'none'} onValueChange={handlePlanoChange}>
              <SelectTrigger id={`plano_id-${lote.id}`}>
                <SelectValue placeholder="Sin plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin plano</SelectItem>
                { (planos || []).map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>{p.nombre} — {p.cuartos}c / {p.banos}b</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">Si eliges un plano, los atributos del lote se actualizarán para coincidir con el plano.</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`valor-${lote.id}`}>Valor ($)</Label>
            <Input id={`valor-${lote.id}`} name="valor" type="number" min="1" defaultValue={undefined} value={valor === '' ? '' : String(valor)} onChange={(e) => setValor(e.target.value === '' ? '' : Number(e.target.value))} required disabled={selectedPlano !== 'none'} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`ubicacion-${lote.id}`}>Ubicacion</Label>
            <Input id={`ubicacion-${lote.id}`} name="ubicacion" defaultValue={lote.ubicacion || ''} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`etapa_id-${lote.id}`}>Etapa</Label>
            <Select name="etapa_id" defaultValue={lote.etapa_id ? String(lote.etapa_id) : 'none'}>
              <SelectTrigger id={`etapa_id-${lote.id}`}>
                <SelectValue placeholder="Sin etapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin etapa</SelectItem>
                {etapas.map((e) => (
                  <SelectItem key={e.id} value={String(e.id)}>
                    {e.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`imagen_url-${lote.id}`}>URL Foto</Label>
            <Input id={`imagen_url-${lote.id}`} name="imagen_url" type="url" defaultValue={lote.imagen_url || ''} placeholder="https://ejemplo.com/foto.jpg" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`descripcion-${lote.id}`}>Descripcion</Label>
            <Textarea id={`descripcion-${lote.id}`} name="descripcion" rows={3} defaultValue={lote.descripcion || ''} />
          </div>

          {/* Hidden inputs to ensure cuartos/banos/parqueaderos are submitted (server will override if plano_id present) */}
          {/* Ensure area and valor are submitted even when inputs are disabled (when a plano is selected) */}
          {selectedPlano !== 'none' && (
            <>
              <input type="hidden" name="plano_id" value={selectedPlano} />
              {area !== '' && <input type="hidden" name="area_m2" value={String(area)} />}
              {valor !== '' && <input type="hidden" name="valor" value={String(valor)} />}
            </>
          )}
          <input type="hidden" name="cuartos" value={(selectedPlano === 'none' ? String(lote.cuartos || 0) : String((planos || []).find((pl) => String(pl.id) === selectedPlano)?.cuartos || 0))} />
          <input type="hidden" name="banos" value={(selectedPlano === 'none' ? String(lote.banos || 0) : String((planos || []).find((pl) => String(pl.id) === selectedPlano)?.banos || 0))} />
          <input type="hidden" name="parqueaderos" value={(selectedPlano === 'none' ? String(lote.parqueaderos || 0) : String((planos || []).find((pl) => String(pl.id) === selectedPlano)?.parqueaderos || 0))} />

          <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Actualizar Lote
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
