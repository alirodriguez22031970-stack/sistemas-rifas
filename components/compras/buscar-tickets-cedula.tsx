'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { Database } from '@/types/database'

type Compra = Database['public']['Tables']['compras']['Row']
type Rifa = Database['public']['Tables']['rifas']['Row']

interface CompraConRifa extends Compra {
  rifas?: Pick<Rifa, 'nombre'>
}

export function BuscarTicketsPorCedula() {
  const supabase = createClientComponentClient<Database>()
  const searchParams = useSearchParams()
  const cedulaParam = searchParams.get('cedula') || ''
  const [cedula, setCedula] = useState(cedulaParam)
  const [resultados, setResultados] = useState<CompraConRifa[]>([])
  const [buscando, setBuscando] = useState(false)

  // Buscar automáticamente si hay cédula en la URL
  useEffect(() => {
    if (cedulaParam) {
      buscarCompras(cedulaParam)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cedulaParam])

  const buscarCompras = async (cedulaBuscar: string) => {
    const cedulaLimpia = cedulaBuscar.trim()
    if (!cedulaLimpia) {
      return
    }

    setBuscando(true)

    const { data, error } = await supabase
      .from('compras')
      .select('id, numeros_asignados, estado, comprador_nombre, comprador_cedula, monto_total, created_at, rifas(nombre)')
      .eq('comprador_cedula', cedulaLimpia)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error buscando compras:', error)
      toast.error('No se pudo realizar la búsqueda')
      setResultados([])
    } else {
      setResultados(data as CompraConRifa[])
      if (data && data.length > 0) {
        toast.success(`Se encontraron ${data.length} compra(s)`)
      }
    }

    setBuscando(false)
  }

  const handleBuscar = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const cedulaLimpia = cedula.trim()
    if (!cedulaLimpia) {
      toast.error('Ingresa una cédula válida')
      return
    }

    await buscarCompras(cedulaLimpia)
  }

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Buscar tickets por cédula</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Ingresa la cédula para conocer los números asignados y el estado de la compra.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBuscar} className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={cedula}
              onChange={(event) => setCedula(event.target.value)}
              placeholder="Ej. 11102916"
              maxLength={20}
            />
            <Button type="submit" disabled={buscando}>
              {buscando ? 'Buscando...' : 'Buscar'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {cedula && (
        <div className="space-y-4">
          {resultados.length === 0 && !buscando ? (
            <Card>
              <CardContent className="py-6 text-center text-muted-foreground">
                No se encontraron compras asociadas a la cédula {cedula.trim()}.
              </CardContent>
            </Card>
          ) : (
            resultados.map((compra) => (
              <Card key={compra.id}>
                <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">{compra.rifas?.nombre ?? 'Rifa'}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      <span className="block sm:inline">Comprador: {compra.comprador_nombre}</span>
                      <span className="hidden sm:inline"> • </span>
                      <span className="block sm:inline">Cédula: {compra.comprador_cedula}</span>
                    </CardDescription>
                  </div>
                  <Badge variant={compra.estado === 'aprobada' ? 'default' : compra.estado === 'pendiente' ? 'secondary' : 'outline'}>
                    {compra.estado.toUpperCase()}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de compra</p>
                    <p className="font-medium">
                      {format(new Date(compra.created_at), "dd 'de' MMMM, yyyy - HH:mm", { locale: es })}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <p className="text-sm text-muted-foreground">Números asignados:</p>
                    <div className="flex flex-wrap gap-2">
                      {compra.numeros_asignados.map((numero) => (
                        <span
                          key={`${compra.id}-${numero}`}
                          className="rounded-md bg-primary/10 px-2 py-1 text-sm font-semibold text-primary"
                        >
                          {numero}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monto pagado</p>
                    <p className="font-semibold">{formatCurrency(compra.monto_total ?? 0)}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </section>
  )
}

