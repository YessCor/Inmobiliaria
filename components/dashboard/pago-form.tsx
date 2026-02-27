'use client'

import * as React from 'react'
import { useActionState } from 'react'
import { registrarPagoAction } from '@/lib/actions/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/format'

interface PagoFormProps {
  compras: Array<{
    id: number
    lote_codigo: string
    saldo_pendiente: number
    cuota_inicial?: number
    valor_cuota?: number
    cuota_inicial_pagada?: boolean
  }>
}

export function PagoForm({ compras }: PagoFormProps) {
  const [state, action, pending] = useActionState(registrarPagoAction, null)

  const [selectedCompra, setSelectedCompra] = React.useState<number | null>(
    compras.length > 0 ? compras[0].id : null,
  )
  const [selectedTipo, setSelectedTipo] = React.useState<string>('cuota_normal')

  React.useEffect(() => {
    // When tipo or compra changes, set monto accordingly
    const compra = compras.find((c) => c.id === Number(selectedCompra))
    const montoInput = document.querySelector<HTMLInputElement>('#monto')
    if (!montoInput || !compra) return
    
    const saldoPendiente = Number(compra.saldo_pendiente) || 0
    const valorCuota = Number(compra.valor_cuota) || 0
    const cuotaInicial = Number(compra.cuota_inicial) || 0
    
    if (selectedTipo === 'cuota_inicial') {
      // Para cuota inicial: mostrar el mínimo entre cuota inicial y saldo pendiente
      montoInput.value = String(Math.min(cuotaInicial, saldoPendiente))
      montoInput.readOnly = true
    } else if (selectedTipo === 'cuota_normal') {
      // Para cuota normal: mostrar el mínimo entre valor cuota y saldo pendiente
      montoInput.value = String(Math.min(valorCuota, saldoPendiente))
      montoInput.readOnly = true
    } else {
      // Para pago adicional: mostrar el saldo pendiente como máximo
      montoInput.value = ''
      montoInput.readOnly = false
      // Establecer el máximo en el saldo pendiente
      montoInput.max = String(saldoPendiente)
    }
  }, [selectedCompra, selectedTipo, compras])

  if (compras.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Registrar Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No tienes compras activas para registrar pagos.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Pago</CardTitle>
      </CardHeader>
      <CardContent>
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
              Pago registrado exitosamente. Sera revisado por el administrador.
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="compra_id">Compra</Label>
            <Select
              name="compra_id"
              required
              onValueChange={(v) => setSelectedCompra(Number(v))}
            >
              <SelectTrigger id="compra_id">
                <SelectValue placeholder="Selecciona la compra" />
              </SelectTrigger>
              <SelectContent>
                {compras.map((compra) => (
                  <SelectItem key={compra.id} value={String(compra.id)}>
                    Lote {compra.lote_codigo} - Saldo: {formatCurrency(Number(compra.saldo_pendiente))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="monto">Monto</Label>
            <Input id="monto" name="monto" type="number" min="1" step="0.01" placeholder="0" required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="metodo_pago">Metodo de Pago</Label>
            <Select name="metodo_pago" required>
              <SelectTrigger id="metodo_pago">
                <SelectValue placeholder="Selecciona metodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transferencia">Transferencia</SelectItem>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="tarjeta">Tarjeta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="tipo">Tipo de Pago</Label>
            <Select
              name="tipo"
              required
              onValueChange={(v) => setSelectedTipo(String(v))}
            >
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Selecciona tipo" />
              </SelectTrigger>
              <SelectContent>
                {(() => {
                  const compra = compras.find((c) => c.id === Number(selectedCompra))
                  const inicialPagada = !!compra?.cuota_inicial_pagada
                  return (
                    <>
                      <SelectItem value="cuota_inicial" disabled={inicialPagada}>
                        Cuota inicial
                      </SelectItem>
                      <SelectItem value="cuota_normal">Cuota mensual</SelectItem>
                      <SelectItem value="adicional">Pago adicional</SelectItem>
                    </>
                  )
                })()}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="referencia">Referencia (opcional)</Label>
            <Input id="referencia" name="referencia" placeholder="Numero de referencia o comprobante" />
          </div>

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              'Registrar Pago'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
