import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { DollarSign, Ticket, ShoppingCart, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function DashboardPage() {
  // Verificación adicional en la página
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/login')
  }

  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  if (user.rol !== 'admin') {
    redirect('/rifas')
  }

  // Estadísticas generales
  const { count: totalRifas } = await supabase
    .from('rifas')
    .select('*', { count: 'exact', head: true })

  const { count: totalCompras } = await supabase
    .from('compras')
    .select('*', { count: 'exact', head: true })

  const { count: comprasPendientes } = await supabase
    .from('compras')
    .select('*', { count: 'exact', head: true })
    .eq('estado', 'pendiente')

  const { count: comprasAprobadas } = await supabase
    .from('compras')
    .select('*', { count: 'exact', head: true })
    .eq('estado', 'aprobada')

  // Ventas totales
  const { data: ventasData } = await supabase
    .from('compras')
    .select('monto_total')
    .eq('estado', 'aprobada')

  const ventasTotales = ventasData?.reduce((sum, compra) => sum + Number(compra.monto_total), 0) || 0

  // Boletos vendidos
  const { data: boletosData } = await supabase
    .from('compras')
    .select('cantidad_boletos')
    .eq('estado', 'aprobada')

  const boletosVendidos = boletosData?.reduce((sum, compra) => sum + compra.cantidad_boletos, 0) || 0

  // Compras recientes
  const { data: comprasRecientes } = await supabase
    .from('compras')
    .select(`
      *,
      rifas (
        nombre
      )
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  // Rifas activas
  const { data: rifasActivas } = await supabase
    .from('rifas')
    .select('*')
    .eq('activa', true)
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    {
      title: 'Ventas Totales',
      value: formatCurrency(ventasTotales),
      icon: DollarSign,
      description: 'Total de ventas aprobadas',
    },
    {
      title: 'Boletos Vendidos',
      value: boletosVendidos.toLocaleString(),
      icon: Ticket,
      description: 'Total de boletos vendidos',
    },
    {
      title: 'Compras Pendientes',
      value: comprasPendientes || 0,
      icon: Clock,
      description: 'Esperando aprobación',
    },
    {
      title: 'Rifas Activas',
      value: totalRifas || 0,
      icon: TrendingUp,
      description: 'Rifas en curso',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen general del sistema de rifas
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compras Recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Compras Recientes</CardTitle>
            <CardDescription>Últimas 5 compras registradas</CardDescription>
          </CardHeader>
          <CardContent>
            {comprasRecientes && comprasRecientes.length > 0 ? (
              <div className="space-y-4">
                {comprasRecientes.map((compra: any) => (
                  <div key={compra.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-semibold">{compra.rifas?.nombre || 'Rifa'}</p>
                      <p className="text-sm text-muted-foreground">
                        {compra.comprador_nombre} - {compra.cantidad_boletos} boletos
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(compra.monto_total)}</p>
                      <p className={`text-xs ${
                        compra.estado === 'aprobada' ? 'text-green-600' :
                        compra.estado === 'pendiente' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {compra.estado}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No hay compras recientes</p>
            )}
          </CardContent>
        </Card>

        {/* Rifas Activas */}
        <Card>
          <CardHeader>
            <CardTitle>Rifas Activas</CardTitle>
            <CardDescription>Rifas en curso</CardDescription>
          </CardHeader>
          <CardContent>
            {rifasActivas && rifasActivas.length > 0 ? (
              <div className="space-y-4">
                {rifasActivas.map((rifa) => {
                  const progreso = Math.round((rifa.numeros_vendidos / rifa.total_numeros) * 100)
                  return (
                    <div key={rifa.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold">{rifa.nombre}</p>
                        <span className="text-sm text-muted-foreground">{progreso}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${progreso}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {rifa.numeros_vendidos} / {rifa.total_numeros} números vendidos
                      </p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No hay rifas activas</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
