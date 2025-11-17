'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const rifaSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().optional(),
  precio: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  fecha_inicio: z.string(),
  fecha_fin: z.string(),
  total_numeros: z.enum(['100', '1000', '10000']),
  visible: z.boolean().default(true),
})

type RifaFormData = z.infer<typeof rifaSchema>

export function CrearRifaDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imagenFile, setImagenFile] = useState<File | null>(null)
  const [imagenPreview, setImagenPreview] = useState<string | null>(null)
  const [subiendoImagen, setSubiendoImagen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<RifaFormData>({
    resolver: zodResolver(rifaSchema),
    defaultValues: {
      visible: true,
      total_numeros: '1000',
    },
  })

  const totalNumeros = watch('total_numeros')

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona un archivo de imagen válido')
        return
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no debe superar los 5MB')
        return
      }

      setImagenFile(file)
      
      // Crear preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagenPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const subirImagen = async (): Promise<string | null> => {
    if (!imagenFile) return null

    setSubiendoImagen(true)
    try {
      // Generar nombre único para el archivo
      const fileExt = imagenFile.name.split('.').pop()
      const fileName = `rifas/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      // Subir a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('rifas-imagenes')
        .upload(fileName, imagenFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Error subiendo imagen:', uploadError)
        throw uploadError
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('rifas-imagenes')
        .getPublicUrl(fileName)

      if (!urlData?.publicUrl) {
        throw new Error('No se pudo obtener la URL de la imagen')
      }

      return urlData.publicUrl
    } catch (error: any) {
      console.error('Error en subirImagen:', error)
      toast.error(error.message || 'Error al subir la imagen')
      return null
    } finally {
      setSubiendoImagen(false)
    }
  }

  const onSubmit = async (data: RifaFormData) => {
    setLoading(true)

    try {
      // Crear FormData para enviar imagen y datos juntos
      const formData = new FormData()
      formData.append('nombre', data.nombre)
      if (data.descripcion) {
        formData.append('descripcion', data.descripcion)
      }
      formData.append('precio', String(data.precio))
      formData.append('fecha_inicio', new Date(data.fecha_inicio).toISOString())
      formData.append('fecha_fin', new Date(data.fecha_fin).toISOString())
      formData.append('total_numeros', data.total_numeros)
      formData.append('visible', String(data.visible))
      
      // Agregar imagen si existe
      if (imagenFile) {
        formData.append('imagen', imagenFile)
      }

      // Usar API route que usa service_role key (bypass RLS)
      // La API route maneja la subida de imagen también
      const response = await fetch('/api/admin/rifas', {
        method: 'POST',
        credentials: 'include', // Incluir cookies para autenticación
        body: formData, // Enviar FormData en lugar de JSON
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Error de API:', result)
        throw new Error(result.error || 'Error al crear la rifa')
      }

      toast.success('Rifa creada exitosamente')
      setOpen(false)
      reset()
      setImagenFile(null)
      setImagenPreview(null)
      router.refresh()
    } catch (error: any) {
      console.error('Error creando rifa:', error)
      toast.error(error.message || 'Error al crear la rifa')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Rifa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Rifa</DialogTitle>
          <DialogDescription>
            Completa el formulario para crear una nueva rifa
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de la Rifa *</Label>
              <Input
                id="nombre"
                {...register('nombre')}
                placeholder="Ej: Rifa de iPhone 15"
                required
              />
              {errors.nombre && (
                <p className="text-xs text-destructive">{errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <textarea
                id="descripcion"
                {...register('descripcion')}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe el premio y detalles de la rifa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imagen">Imagen de la Rifa (Opcional)</Label>
              <Input
                id="imagen"
                type="file"
                accept="image/*"
                onChange={handleImagenChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
              </p>
              {imagenPreview && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Vista previa:</p>
                  <img
                    src={imagenPreview}
                    alt="Vista previa"
                    className="h-32 w-full rounded-md object-cover border border-input"
                  />
                </div>
              )}
              {subiendoImagen && (
                <p className="text-xs text-blue-600">Subiendo imagen...</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="precio">Precio por Número (USD) *</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...register('precio', { valueAsNumber: true })}
                  required
                />
                {errors.precio && (
                  <p className="text-xs text-destructive">{errors.precio.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_numeros">Total de Números *</Label>
                <Select
                  value={totalNumeros}
                  onValueChange={(value) => setValue('total_numeros', value as '100' | '1000' | '10000')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100 números</SelectItem>
                    <SelectItem value="1000">1,000 números</SelectItem>
                    <SelectItem value="10000">10,000 números</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha_inicio">Fecha de Inicio *</Label>
                <Input
                  id="fecha_inicio"
                  type="datetime-local"
                  {...register('fecha_inicio')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha_fin">Fecha de Fin *</Label>
                <Input
                  id="fecha_fin"
                  type="datetime-local"
                  {...register('fecha_fin')}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="visible"
                {...register('visible')}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="visible" className="cursor-pointer">
                Rifa visible para usuarios (desmarcar para ocultar)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              setOpen(false)
              setImagenFile(null)
              setImagenPreview(null)
            }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || subiendoImagen}>
              {subiendoImagen ? 'Subiendo imagen...' : loading ? 'Creando...' : 'Crear Rifa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

