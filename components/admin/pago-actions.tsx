'use client'

import { aprobarPagoAction, rechazarPagoAction } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  pagoId: number
}

export function PagoActions({ pagoId }: Props) {
  const [showReject, setShowReject] = useState(false)
  const [motivo, setMotivo] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleRechazar = async () => {
    // Validar motivo
    if (!motivo || motivo.trim().length === 0) {
      setError('El motivo del rechazo es obligatorio')
      return
    }

    setIsSubmitting(true)
    setError('')

    const result = await rechazarPagoAction(pagoId, motivo)
    
    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
      return
    }

    setShowReject(false)
    setMotivo('')
    setIsSubmitting(false)
    router.refresh()
  }

  const handleCancelar = () => {
    // Solo cierra el modal sin ejecutar nada
    setShowReject(false)
    setMotivo('')
    setError('')
  }

  if (showReject) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Escribe el motivo del rechazo"
            value={motivo}
            onChange={(e) => {
              setMotivo(e.target.value)
              setError('')
            }}
            className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
            disabled={isSubmitting}
          />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <div className="flex items-center gap-2">
          <Button 
            type="button" 
            size="sm" 
            variant="outline" 
            onClick={handleCancelar}
            disabled={isSubmitting}
            className="gap-1"
          >
            <X className="h-3 w-3" />
            Cancelar
          </Button>
          <Button 
            type="button" 
            size="sm" 
            variant="destructive" 
            onClick={handleRechazar}
            disabled={isSubmitting}
            className="gap-1"
          >
            <Check className="h-3 w-3" />
            Confirmar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <form action={() => aprobarPagoAction(pagoId)}>
        <Button type="submit" size="sm" variant="outline" className="gap-1 text-accent">
          <Check className="h-3 w-3" />
          Aprobar
        </Button>
      </form>
      <Button 
        type="button" 
        size="sm" 
        variant="outline" 
        className="gap-1 text-destructive" 
        onClick={() => setShowReject(true)}
      >
        <X className="h-3 w-3" />
        Rechazar
      </Button>
    </div>
  )
}
