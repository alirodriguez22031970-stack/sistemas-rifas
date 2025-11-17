'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { Database } from '@/types/database'

type Rifa = Database['public']['Tables']['rifas']['Row']

interface TablaNumerosRifaProps {
  rifa: Rifa
}

export function TablaNumerosRifa({ rifa }: TablaNumerosRifaProps) {
  const supabase = createClientComponentClient<Database>()
  const [mostrarTabla, setMostrarTabla] = useState(false)
  const [numerosVendidos, setNumerosVendidos] = useState<number[]>([])
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    if (mostrarTabla && numerosVendidos.length === 0 && !cargando) {
      cargarNumerosVendidos()
    }
  }, [mostrarTabla])

  const cargarNumerosVendidos = async () => {
    setCargando(true)
    try {
      const { data, error } = await supabase
        .from('numeros_vendidos')
        .select('numero')
        .eq('rifa_id', rifa.id)

      if (error) {
        console.error('Error cargando números vendidos:', error)
      } else {
        setNumerosVendidos(data?.map(n => n.numero) || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setCargando(false)
    }
  }

  // Generar array de todos los números
  const todosLosNumeros = Array.from({ length: rifa.total_numeros }, (_, i) => i + 1)
  
  // Dividir en números vendidos y disponibles
  const numerosDisponibles = todosLosNumeros.filter(n => !numerosVendidos.includes(n))

  // Función para renderizar la tabla de números
  const renderTablaNumeros = () => {
    if (cargando) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Cargando números...</span>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {/* Resumen */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <div className="rounded-lg bg-green-50 p-3 sm:p-4 border border-green-200">
            <p className="text-xs sm:text-sm font-semibold text-green-800 mb-1">Disponibles</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">{numerosDisponibles.length}</p>
          </div>
          <div className="rounded-lg bg-red-50 p-3 sm:p-4 border border-red-200">
            <p className="text-xs sm:text-sm font-semibold text-red-800 mb-1">Vendidos</p>
            <p className="text-xl sm:text-2xl font-bold text-red-600">{numerosVendidos.length}</p>
          </div>
        </div>

        {/* Tabla de números */}
        <div className="max-h-96 overflow-y-auto border rounded-lg bg-white">
          <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20 gap-1 p-2">
            {todosLosNumeros.map((numero) => {
              const vendido = numerosVendidos.includes(numero)
              return (
                <div
                  key={numero}
                  className={`
                    p-1 sm:p-1.5 text-center text-[10px] sm:text-xs font-semibold rounded
                    transition-colors cursor-default
                    ${vendido 
                      ? 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200'
                    }
                  `}
                  title={vendido ? `Número ${numero} - Vendido` : `Número ${numero} - Disponible`}
                >
                  {numero}
                </div>
              )
            })}
          </div>
        </div>

        {/* Leyenda */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-green-100 border border-green-300"></div>
            <span className="text-muted-foreground">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-red-100 border border-red-300"></div>
            <span className="text-muted-foreground">Vendido</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <CardTitle className="text-base sm:text-lg">Tabla de Números</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMostrarTabla(!mostrarTabla)}
            className="w-full sm:w-auto"
          >
            {mostrarTabla ? (
              <>
                <ChevronUp className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Ocultar</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Mostrar</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      {mostrarTabla && (
        <CardContent>
          {renderTablaNumeros()}
        </CardContent>
      )}
    </Card>
  )
}

