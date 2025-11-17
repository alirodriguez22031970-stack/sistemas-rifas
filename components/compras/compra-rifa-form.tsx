'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'
import { Rifa, MetodoPago } from '@/types/database'
import toast from 'react-hot-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const compraSchema = z.object({
  comprador_nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  comprador_cedula: z.string().min(6, 'La cédula debe tener al menos 6 caracteres'),
  comprador_telefono: z.string().min(10, 'El teléfono debe tener al menos 10 caracteres'),
  metodo_pago: z.enum(['pago_movil', 'zelle', 'transferencia']),
  referencia_pago: z.string().optional(),
  cantidad_boletos: z.number().min(2, 'Debes comprar al menos 2 boletos').refine((val) => val % 2 === 0, {
    message: 'Debes comprar boletos de 2 en 2 (2, 4, 6, 8, etc.)',
  }),
  numeros_seleccionados: z.array(z.number()).min(2, 'Debes comprar al menos 2 números'),
})

type CompraFormData = z.infer<typeof compraSchema>

interface CompraRifaFormProps {
  rifa: Rifa
  numerosOcupados: number[]
  finalizada: boolean
}

export function CompraRifaForm({ rifa, numerosOcupados, finalizada }: CompraRifaFormProps) {
  const router = useRouter()
  const [cantidad, setCantidad] = useState(2) // Mínimo 2
  const [numerosDisponibles, setNumerosDisponibles] = useState<number[]>([])
  const [numerosAsignados, setNumerosAsignados] = useState<number[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CompraFormData>({
    resolver: zodResolver(compraSchema),
    defaultValues: {
      cantidad_boletos: 2,
      numeros_seleccionados: [],
    },
  })

  const metodoPago = watch('metodo_pago')

  // Generar números disponibles
  useEffect(() => {
    const todos = Array.from({ length: rifa.total_numeros }, (_, i) => i + 1)
    const disponibles = todos.filter(n => !numerosOcupados.includes(n))
    setNumerosDisponibles(disponibles)
  }, [rifa.total_numeros, numerosOcupados])

  // Asignar números aleatorios cuando cambia la cantidad
  useEffect(() => {
    if (cantidad >= 2 && numerosDisponibles.length >= cantidad) {
      // Mezclar array y tomar los primeros 'cantidad' números
      const shuffled = [...numerosDisponibles].sort(() => Math.random() - 0.5)
      const asignados = shuffled.slice(0, cantidad)
      setNumerosAsignados(asignados)
      setValue('numeros_seleccionados', asignados)
      setValue('cantidad_boletos', cantidad)
    } else {
      setNumerosAsignados([])
      setValue('numeros_seleccionados', [])
    }
  }, [cantidad, numerosDisponibles, setValue])

  const montoTotal = cantidad * rifa.precio

  const onSubmit = async (data: CompraFormData) => {
    if (finalizada) {
      toast.error('Esta rifa ya está finalizada')
      return
    }

    // Validar cantidad mínima de 2 y múltiplo de 2
    if (cantidad < 2) {
      toast.error('Debes comprar al menos 2 boletos')
      return
    }

    if (cantidad % 2 !== 0) {
      toast.error('Debes comprar boletos de 2 en 2 (2, 4, 6, 8, etc.)')
      return
    }

    if (numerosAsignados.length !== cantidad) {
      toast.error('Error al asignar números. Por favor, intenta de nuevo.')
      return
    }

    // Validar que los números estén disponibles
    const numerosOcupadosAhora = numerosAsignados.filter(n => numerosOcupados.includes(n))
    if (numerosOcupadosAhora.length > 0) {
      // Reasignar números si algunos están ocupados
      const disponibles = numerosDisponibles.filter(n => !numerosOcupados.includes(n))
      if (disponibles.length < cantidad) {
        toast.error('No hay suficientes números disponibles')
        return
      }
      // Reasignar aleatoriamente
      const shuffled = [...disponibles].sort(() => Math.random() - 0.5)
      const nuevosAsignados = shuffled.slice(0, cantidad)
      setNumerosAsignados(nuevosAsignados)
      setValue('numeros_seleccionados', nuevosAsignados)
    }

    try {
      const { data: compra, error } = await supabase
        .from('compras')
        .insert({
          rifa_id: rifa.id,
          comprador_nombre: data.comprador_nombre,
          comprador_cedula: data.comprador_cedula,
          comprador_telefono: data.comprador_telefono,
          metodo_pago: data.metodo_pago,
          referencia_pago: data.referencia_pago || null,
          monto_total: montoTotal,
          cantidad_boletos: cantidad,
          numeros_asignados: numerosAsignados,
          estado: 'pendiente',
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Compra registrada exitosamente. Espera la aprobación del administrador.')
      router.push('/')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Error al registrar la compra')
    }
  }

  if (finalizada) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rifa Finalizada</CardTitle>
          <CardDescription>Esta rifa ya no acepta más compras</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comprar Boletos</CardTitle>
        <CardDescription>Completa el formulario para realizar tu compra</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cantidad">Cantidad de Boletos (mínimo 2, de 2 en 2)</Label>
            <Input
              id="cantidad"
              type="number"
              min={2}
              step={2}
              max={Math.min(100, numerosDisponibles.length)}
              value={cantidad}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 2
                // Asegurar que sea múltiplo de 2 y mínimo 2
                const cantidadAjustada = Math.max(2, Math.floor(val / 2) * 2)
                const maxCantidad = Math.min(100, Math.floor(numerosDisponibles.length / 2) * 2)
                setCantidad(Math.min(cantidadAjustada, maxCantidad))
              }}
            />
            <p className="text-xs text-muted-foreground">
              Disponibles: {numerosDisponibles.length} números | 
              Máximo: {Math.floor(numerosDisponibles.length / 2) * 2} boletos
            </p>
            <p className="text-xs text-blue-600">
              Los números se asignarán automáticamente de forma aleatoria
            </p>
          </div>

          {numerosAsignados.length > 0 && (
            <div className="space-y-2">
              <Label>Números Asignados (Aleatorios)</Label>
              <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-md max-h-32 overflow-y-auto">
                {numerosAsignados.sort((a, b) => a - b).map((num) => (
                  <span
                    key={num}
                    className="px-2 py-1 bg-primary text-primary-foreground rounded text-sm"
                  >
                    {num}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {numerosAsignados.length} número{numerosAsignados.length > 1 ? 's' : ''} asignado{numerosAsignados.length > 1 ? 's' : ''} aleatoriamente
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="comprador_nombre">Nombre Completo</Label>
            <Input
              id="comprador_nombre"
              {...register('comprador_nombre')}
              placeholder="Juan Pérez"
            />
            {errors.comprador_nombre && (
              <p className="text-xs text-destructive">{errors.comprador_nombre.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comprador_cedula">Cédula</Label>
            <Input
              id="comprador_cedula"
              {...register('comprador_cedula')}
              placeholder="12345678"
            />
            {errors.comprador_cedula && (
              <p className="text-xs text-destructive">{errors.comprador_cedula.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comprador_telefono">Teléfono</Label>
            <Input
              id="comprador_telefono"
              {...register('comprador_telefono')}
              placeholder="04141234567"
            />
            {errors.comprador_telefono && (
              <p className="text-xs text-destructive">{errors.comprador_telefono.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="metodo_pago">Método de Pago</Label>
            <Select
              onValueChange={(value) => setValue('metodo_pago', value as MetodoPago)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona método de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pago_movil">Pago Móvil</SelectItem>
                <SelectItem value="zelle">Zelle</SelectItem>
                <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
              </SelectContent>
            </Select>
            {errors.metodo_pago && (
              <p className="text-xs text-destructive">{errors.metodo_pago.message}</p>
            )}
          </div>

          {metodoPago && (
            <div className="space-y-2">
              <Label htmlFor="referencia_pago">Referencia de Pago</Label>
              <Input
                id="referencia_pago"
                {...register('referencia_pago')}
                placeholder="Número de referencia"
              />
              <p className="text-xs text-muted-foreground">
                Ingresa el número de referencia de tu pago
              </p>
            </div>
          )}

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total a Pagar:</span>
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(montoTotal)}
              </span>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting || finalizada}>
              {isSubmitting ? 'Procesando...' : 'Confirmar Compra'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

