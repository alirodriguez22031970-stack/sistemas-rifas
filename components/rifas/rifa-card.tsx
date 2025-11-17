'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { formatCurrency, calculateProgress, getRifaBadge } from '@/lib/utils'
import { Rifa } from '@/types/database'
import { Calendar, DollarSign, Ticket } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface RifaCardProps {
  rifa: Rifa
}

export function RifaCard({ rifa }: RifaCardProps) {
  const progress = calculateProgress(rifa.numeros_vendidos, rifa.total_numeros)
  const badge = getRifaBadge(rifa)
  const numerosDisponibles = rifa.total_numeros - rifa.numeros_vendidos
  const fechaFin = new Date(rifa.fecha_fin)
  const ahora = new Date()
  const finalizada = fechaFin < ahora || rifa.numeros_vendidos >= rifa.total_numeros

  const badgeLabels = {
    nueva: { label: 'Nueva', variant: 'info' as const },
    casi_llena: { label: 'Casi Llena', variant: 'warning' as const },
    finaliza_pronto: { label: 'Finaliza Pronto', variant: 'destructive' as const },
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full bg-gradient-to-br from-blue-400 to-purple-500">
        {rifa.imagen_url && (
          <Image
            src={rifa.imagen_url}
            alt={rifa.nombre}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          {badge && (
            <Badge variant={badgeLabels[badge].variant}>
              {badgeLabels[badge].label}
            </Badge>
          )}
          {finalizada && (
            <Badge variant="destructive">Finalizada</Badge>
          )}
        </div>
      </div>
      <CardHeader>
        <h3 className="text-xl font-bold line-clamp-2">{rifa.nombre}</h3>
        {rifa.descripcion && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {rifa.descripcion}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-lg">{formatCurrency(rifa.precio)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-muted-foreground" />
            <span>{numerosDisponibles} disponibles</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progreso</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
          <p className="text-xs text-center text-muted-foreground">
            {rifa.numeros_vendidos} / {rifa.total_numeros} números vendidos
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Finaliza: {format(fechaFin, "d 'de' MMMM, yyyy", { locale: es })}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/rifas/${rifa.id}`} className="w-full">
          <Button className="w-full" disabled={finalizada}>
            {finalizada ? 'Finalizada' : 'Ver Detalles'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

