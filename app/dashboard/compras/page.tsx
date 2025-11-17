import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatPhoneNumber } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CheckCircle, XCircle, Clock, Search, Edit } from 'lucide-react'
import { AprobarCompraButton, RechazarCompraButton } from '@/components/admin/acciones-compra'
import { EditarCompradorDialog } from '@/components/admin/editar-comprador-dialog'
import { EnviarWhatsAppButton } from '@/components/admin/enviar-whatsapp-button'

export default async function ComprasAdminPage({
  searchParams,
}: {
  searchParams: { estado?: string; busqueda?: string }
}) {
  const supabase = createServerSupabaseClient()

  let query = supabase
    .from('compras')
    .select(`
      *,
      rifas (
        id,
        nombre,
        precio
      )
    `)
    .order('created_at', { ascending: false })

  if (searchParams.estado) {
    query = query.eq('estado', searchParams.estado)
  }

  if (searchParams.busqueda) {
    query = query.or(`comprador_nombre.ilike.%${searchParams.busqueda}%,comprador_cedula.ilike.%${searchParams.busqueda}%`)
  }

  const { data: compras, error } = await query

  if (error) {
    console.error('Error fetching compras:', error)
  }

  const estadoConfig = {
    pendiente: { label: 'Pendiente', variant: 'warning' as const, icon: Clock },
    aprobada: { label: 'Aprobada', variant: 'success' as const, icon: CheckCircle },
    rechazada: { label: 'Rechazada', variant: 'destructive' as const, icon: XCircle },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Gestión de Compras</h1>
        <p className="text-muted-foreground">
          Administra y aprueba las compras de boletos
        </p>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form method="get" className="flex gap-4">
            <Input
              name="busqueda"
              placeholder="Buscar por nombre o cédula..."
              defaultValue={searchParams.busqueda}
              className="flex-1"
            />
            <select
              name="estado"
              defaultValue={searchParams.estado || ''}
              className="h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="aprobada">Aprobada</option>
              <option value="rechazada">Rechazada</option>
            </select>
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      {compras && compras.length > 0 ? (
        <div className="space-y-4">
          {compras.map((compra: any) => {
            const estado = estadoConfig[compra.estado as keyof typeof estadoConfig]
            const Icon = estado.icon

            return (
              <Card key={compra.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{compra.rifas?.nombre || 'Rifa'}</CardTitle>
                      <CardDescription>
                        {format(new Date(compra.created_at), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                      </CardDescription>
                    </div>
                    <Badge variant={estado.variant} className="flex items-center gap-1">
                      <Icon className="h-3 w-3" />
                      {estado.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Comprador</p>
                      <p className="font-semibold">{compra.comprador_nombre}</p>
                      <p className="text-sm text-muted-foreground">Cédula: {compra.comprador_cedula}</p>
                      <p className="text-sm text-muted-foreground">Tel: {formatPhoneNumber(compra.comprador_telefono)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Detalles</p>
                      <p className="font-semibold">{compra.cantidad_boletos} boletos</p>
                      <p className="text-sm text-muted-foreground">
                        Números: {compra.numeros_asignados.slice(0, 10).join(', ')}
                        {compra.numeros_asignados.length > 10 && ` +${compra.numeros_asignados.length - 10} más`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Método: {compra.metodo_pago.replace('_', ' ').toUpperCase()}
                      </p>
                      {compra.referencia_pago && (
                        <p className="text-sm text-muted-foreground">
                          Ref: {compra.referencia_pago}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(compra.monto_total)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    {compra.estado === 'pendiente' && (
                      <>
                        <AprobarCompraButton compraId={compra.id} />
                        <RechazarCompraButton compraId={compra.id} />
                        <EditarCompradorDialog compra={compra} />
                      </>
                    )}
                    {compra.estado === 'aprobada' && (
                      <EnviarWhatsAppButton compra={compra} rifa={compra.rifas} />
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground text-lg">
              No se encontraron compras
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

