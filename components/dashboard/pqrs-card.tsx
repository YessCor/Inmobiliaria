"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, getEstadoLabel, getEstadoColor, getPqrsTypeLabel } from '@/lib/format'

interface PqrsItem {
  id: number
  tipo: string
  asunto: string
  descripcion: string
  respuesta?: string | null
  created_at: string
  estado: string
}

function TruncatedText({ text, limit = 200 }: { text: string; limit?: number }) {
  const [open, setOpen] = useState(false)
  if (!text) return null
  const trimmed = text.trim()
  const isLong = trimmed.length > limit
  if (!isLong) return <p className="text-sm text-muted-foreground leading-relaxed">{trimmed}</p>
  return (
    <div>
      <p className="text-sm text-muted-foreground leading-relaxed">{open ? trimmed : `${trimmed.slice(0, limit)}...`}</p>
      <button type="button" onClick={() => setOpen(!open)} className="mt-2 text-sm text-primary hover:underline">
        {open ? 'Ver menos' : 'Ver más'}
      </button>
    </div>
  )
}

export function PqrsCard({ item }: { item: PqrsItem }) {
  return (
    <Card key={item.id}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{getPqrsTypeLabel(item.tipo)}</Badge>
            <CardTitle className="text-base">{item.asunto}</CardTitle>
          </div>
          <Badge className={getEstadoColor(item.estado)}>{getEstadoLabel(item.estado)}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{formatDate(item.created_at)}</p>
      </CardHeader>
      <CardContent>
        <TruncatedText text={item.descripcion || ''} limit={250} />
        {item.respuesta && (
          <div className="mt-4 rounded-lg border border-border bg-muted/50 p-4">
            <p className="mb-1 text-xs font-medium text-foreground">Respuesta:</p>
            <TruncatedText text={item.respuesta} limit={300} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PqrsCard
