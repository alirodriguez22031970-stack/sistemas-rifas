import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatPhoneNumber } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { redirect } from 'next/navigation'

export default async function ComprasPage() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Obtener compras del usuario (por cédula o email)
  const { data: usuario } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', session.user.id)
    .single()

  // Por ahora, mostrar todas las compras. En producción, filtrar por usuario
  const { data: compras, error } = await supabase
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

  if (error) {
    console.error('Error fetching compras:', error)
  }

  const estadoConfig = {
    pendiente: { label: 'Pendiente', variant: 'warning' as const, icon: Clock },
    aprobada: { label: 'Aprobada', variant: 'success' as const, icon: CheckCircle },
    rechazada: { label: 'Rechazada', variant: 'destructive' as const, icon: XCircle },
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Mis Compras</h1>
          <p className="text-muted-foreground">
            Historial de todas tus compras de boletos
          </p>
        </div>

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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          Números: {compra.numeros_asignados.slice(0, 5).join(', ')}
                          {compra.numeros_asignados.length > 5 && ` +${compra.numeros_asignados.length - 5} más`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Método: {compra.metodo_pago.replace('_', ' ').toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(compra.monto_total)}</p>
                        {compra.referencia_pago && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Ref: {compra.referencia_pago}
                          </p>
                        )}
                      </div>
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
                No tienes compras registradas
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      </div>
    </>
  )
}

