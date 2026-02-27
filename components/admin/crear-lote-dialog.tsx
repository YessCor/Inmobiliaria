"use client"

import { useActionState, useEffect, useState } from 'react'
import { crearLoteAction } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, CheckCircle2, Loader2, Plus } from 'lucide-react'

interface Props {
  etapas: Array<{ id: number; nombre: string }>
  planos?: Array<{ id: number; nombre: string; cuartos?: number; banos?: number; parqueaderos?: number; valor?: number; area_m2?: number }>
}

export function CrearLoteDialog({ etapas, planos }: Props) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(crearLoteAction, null)
  const [selectedPlano, setSelectedPlano] = useState<string>('none')
  const [area, setArea] = useState<string>('')
  const [valor, setValor] = useState<string>('')

  useEffect(() => {
    if (!open) {
      setSelectedPlano('none')
      setArea('')
      setValor('')
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" />Nuevo Lote</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Lote</DialogTitle>
          <DialogDescription>Completa los datos para crear un nuevo lote.</DialogDescription>
        </DialogHeader>
        <form action={action} className="flex flex-col gap-4">
          {state?.error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />{state.error}
            </div>
          )}
          {state?.success && (
            <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2.5 text-sm text-accent-foreground">
              <CheckCircle2 className="h-4 w-4 shrink-0" />Lote creado exitosamente.
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="codigo">Codigo</Label>
              <Input id="codigo" name="codigo" placeholder="L-011" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="area_m2">Area (m2)</Label>
              <Input id="area_m2" name="area_m2" type="number" min="1" step="0.01" required value={area} onChange={(e) => setArea(e.target.value)} disabled={selectedPlano !== 'none'} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="plano_id">Plano (tipo de casa)</Label>
            <Select name="plano_id" defaultValue="none" onValueChange={(v: string) => {
              setSelectedPlano(v)
              if (v === 'none') {
                setArea('')
                setValor('')
              } else {
                const p = (planos || []).find((pl) => String(pl.id) === v)
                if (p) {
                  if (typeof p.area_m2 !== 'undefined') setArea(String(p.area_m2))
                  if (typeof p.valor !== 'undefined') setValor(String(p.valor))
                }
              }
            }}>
              <SelectTrigger id="plano_id"><SelectValue placeholder="Sin plano (ingresar atributos manualmente)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin plano</SelectItem>
                { (planos || []).map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>{p.nombre} — {p.cuartos}c / {p.banos}b</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">Si eliges un plano, los atributos de cuartos/baños/parqueaderos se copiarán automáticamente.</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="valor">Valor ($)</Label>
            <Input id="valor" name="valor" type="number" min="1" required value={valor} onChange={(e) => setValor(e.target.value)} disabled={selectedPlano !== 'none'} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ubicacion">Ubicacion</Label>
            <Input id="ubicacion" name="ubicacion" placeholder="Manzana A" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="etapa_id">Etapa</Label>
            <Select name="etapa_id" defaultValue="none">
              <SelectTrigger id="etapa_id"><SelectValue placeholder="Sin etapa" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin etapa</SelectItem>
                {etapas.map((e) => (
                  <SelectItem key={e.id} value={String(e.id)}>{e.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="imagen_url">URL Foto (opcional)</Label>
            <Input id="imagen_url" name="imagen_url" type="url" placeholder="https://ejemplo.com/foto.jpg" />
          </div>
          <input type="hidden" name="estado" value="disponible" />
          {/* Hidden fields to submit plano-derived attributes when a plano is selected */}
          <input type="hidden" name="cuartos" value={(selectedPlano === 'none' ? '0' : String((planos || []).find((pl) => String(pl.id) === selectedPlano)?.cuartos || 0))} />
          <input type="hidden" name="banos" value={(selectedPlano === 'none' ? '0' : String((planos || []).find((pl) => String(pl.id) === selectedPlano)?.banos || 0))} />
          <input type="hidden" name="parqueaderos" value={(selectedPlano === 'none' ? '0' : String((planos || []).find((pl) => String(pl.id) === selectedPlano)?.parqueaderos || 0))} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="descripcion">Descripcion</Label>
            <Textarea id="descripcion" name="descripcion" rows={2} />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Crear Lote
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
