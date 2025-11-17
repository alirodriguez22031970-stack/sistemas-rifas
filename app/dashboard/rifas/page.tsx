import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, calculateProgress } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Plus, Edit, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { CrearRifaDialog } from '@/components/admin/crear-rifa-dialog'
import { ToggleVisibilidadButton } from '@/components/admin/toggle-visibilidad-button'
import { EliminarRifaButton } from '@/components/admin/eliminar-rifa-button'

export default async function RifasAdminPage() {
  const supabase = createServerSupabaseClient()

  const { data: rifas, error } = await supabase
    .from('rifas')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching rifas:', error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Gestión de Rifas</h1>
          <p className="text-muted-foreground">
            Administra todas las rifas del sistema
          </p>
        </div>
        <CrearRifaDialog />
      </div>

      {rifas && rifas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rifas.map((rifa) => {
            const progress = calculateProgress(rifa.numeros_vendidos, rifa.total_numeros)
            const fechaFin = new Date(rifa.fecha_fin)
            const ahora = new Date()
            const finalizada = fechaFin < ahora || rifa.numeros_vendidos >= rifa.total_numeros

            return (
              <Card key={rifa.id} className="overflow-hidden">
                <div className="relative h-48 w-full bg-gradient-to-br from-blue-400 to-purple-500">
                  {rifa.imagen_url && (
                    <img
                      src={rifa.imagen_url}
                      alt={rifa.nombre}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    {!rifa.visible && (
                      <Badge variant="outline" className="bg-black/50 text-white">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Oculto
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
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg">{formatCurrency(rifa.precio)}</span>
                    <span className="text-sm text-muted-foreground">
                      {rifa.total_numeros - rifa.numeros_vendidos} disponibles
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progreso</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                      {rifa.numeros_vendidos} / {rifa.total_numeros} números vendidos
                    </p>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p>
                      Finaliza: {format(fechaFin, "d 'de' MMMM, yyyy", { locale: es })}
                    </p>
                  </div>
                </CardContent>
                <CardContent className="pt-0 flex gap-2">
                  <Link href={`/rifas/${rifa.id}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                  </Link>
                  <ToggleVisibilidadButton rifaId={rifa.id} visible={rifa.visible} />
                  <EliminarRifaButton rifaId={rifa.id} rifaNombre={rifa.nombre} />
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground text-lg mb-4">
              No hay rifas creadas
            </p>
            <CrearRifaDialog />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

