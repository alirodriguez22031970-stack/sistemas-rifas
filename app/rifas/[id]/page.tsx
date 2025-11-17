import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { formatCurrency, calculateProgress, getRifaBadge } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, DollarSign, Ticket, Info } from 'lucide-react'
import { CompraRifaForm } from '@/components/compras/compra-rifa-form'
import { Navbar } from '@/components/layout/navbar'
import { TablaNumerosRifa } from '@/components/rifas/tabla-numeros-rifa'

export default async function RifaDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerSupabaseClient()
  const { data: rifa, error } = await supabase
    .from('rifas')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !rifa) {
    notFound()
  }

  // Obtener números vendidos para validación
  const { data: numerosVendidos } = await supabase
    .from('numeros_vendidos')
    .select('numero')
    .eq('rifa_id', rifa.id)

  const numerosOcupados = numerosVendidos?.map(n => n.numero) || []
  const progress = calculateProgress(rifa.numeros_vendidos, rifa.total_numeros)
  const badge = getRifaBadge(rifa)
  const fechaFin = new Date(rifa.fecha_fin)
  const ahora = new Date()
  const finalizada = fechaFin < ahora || rifa.numeros_vendidos >= rifa.total_numeros

  const badgeLabels = {
    nueva: { label: 'Nueva', variant: 'info' as const },
    casi_llena: { label: 'Casi Llena', variant: 'warning' as const },
    finaliza_pronto: { label: 'Finaliza Pronto', variant: 'destructive' as const },
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagen y detalles */}
          <div className="space-y-4">
            <div className="relative h-48 sm:h-64 md:h-96 w-full rounded-lg overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
              {rifa.imagen_url && (
                <Image
                  src={rifa.imagen_url}
                  alt={rifa.nombre}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute top-4 right-4 flex gap-2">
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

            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{rifa.nombre}</h1>
              {rifa.descripcion && (
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">{rifa.descripcion}</p>
              )}

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <span className="text-xl sm:text-2xl font-bold">{formatCurrency(rifa.precio)}</span>
                    <span className="text-xs sm:text-sm text-muted-foreground">por número</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progreso de ventas</span>
                    <span className="font-semibold">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{rifa.numeros_vendidos} vendidos</span>
                    <span>{rifa.total_numeros - rifa.numeros_vendidos} disponibles</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Finaliza: {format(fechaFin, "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                  <span>Total de números: <strong>{rifa.total_numeros}</strong></span>
                </div>
              </div>
            </div>

            {/* Tabla de números */}
            <TablaNumerosRifa rifa={rifa} />
          </div>

          {/* Formulario de compra */}
          <div className="lg:sticky lg:top-8 h-fit">
            <CompraRifaForm
              rifa={rifa}
              numerosOcupados={numerosOcupados}
              finalizada={finalizada}
            />
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

