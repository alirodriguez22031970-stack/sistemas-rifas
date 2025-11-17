import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraficaMetodosPago } from '@/components/estadisticas/grafica-metodos-pago'
import { GraficaVentasMes } from '@/components/estadisticas/grafica-ventas-mes'
import { GraficaParticipantes } from '@/components/estadisticas/grafica-participantes'

export default async function EstadisticasPage() {
  const supabase = createServerSupabaseClient()

  // Top 5 participantes por rifa
  const { data: compras } = await supabase
    .from('compras')
    .select(`
      *,
      rifas (
        nombre
      )
    `)
    .eq('estado', 'aprobada')

  // Agrupar por cédula y rifa
  const participantesPorRifa: Record<string, Record<string, number>> = {}
  
  compras?.forEach((compra: any) => {
    const rifaNombre = compra.rifas?.nombre || 'Sin nombre'
    const cedula = compra.comprador_cedula
    
    if (!participantesPorRifa[rifaNombre]) {
      participantesPorRifa[rifaNombre] = {}
    }
    
    if (!participantesPorRifa[rifaNombre][cedula]) {
      participantesPorRifa[rifaNombre][cedula] = 0
    }
    
    participantesPorRifa[rifaNombre][cedula] += compra.cantidad_boletos
  })

  // Preparar datos para gráfica
  const topParticipantes = Object.entries(participantesPorRifa).map(([rifa, participantes]) => {
    const sorted = Object.entries(participantes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
    
    return {
      rifa,
      participantes: sorted.map(([cedula, cantidad]) => ({
        cedula: cedula.slice(-4), // Últimos 4 dígitos
        cantidad,
      })),
    }
  })

  // Estadísticas por método de pago
  const metodosPago = compras?.reduce((acc: Record<string, number>, compra: any) => {
    const metodo = compra.metodo_pago
    acc[metodo] = (acc[metodo] || 0) + 1
    return acc
  }, {}) || {}

  const datosMetodosPago = Object.entries(metodosPago).map(([metodo, cantidad]) => ({
    name: metodo.replace('_', ' ').toUpperCase(),
    value: cantidad,
  }))

  // Ventas por mes
  const ventasPorMes = compras?.reduce((acc: Record<string, number>, compra: any) => {
    const fecha = new Date(compra.created_at)
    const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
    acc[mes] = (acc[mes] || 0) + Number(compra.monto_total)
    return acc
  }, {}) || {}

  const datosVentasPorMes = Object.entries(ventasPorMes)
    .sort()
    .map(([mes, total]) => ({
      mes: mes.slice(5), // Solo el mes
      total: Number(total),
    }))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Estadísticas Avanzadas</h1>
        <p className="text-muted-foreground">
          Análisis detallado de ventas y participación
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfica de métodos de pago */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Método de Pago</CardTitle>
            <CardDescription>Compras aprobadas por método de pago</CardDescription>
          </CardHeader>
          <CardContent>
            <GraficaMetodosPago data={datosMetodosPago} />
          </CardContent>
        </Card>

        {/* Gráfica de ventas por mes */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Mes</CardTitle>
            <CardDescription>Total de ventas aprobadas por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <GraficaVentasMes data={datosVentasPorMes} />
          </CardContent>
        </Card>
      </div>

      {/* Top participantes por rifa */}
      <div className="space-y-6">
        {topParticipantes.map(({ rifa, participantes }) => (
          <Card key={rifa}>
            <CardHeader>
              <CardTitle>Top 5 Participantes - {rifa}</CardTitle>
              <CardDescription>Participantes con más boletos comprados</CardDescription>
            </CardHeader>
            <CardContent>
              <GraficaParticipantes data={participantes} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

