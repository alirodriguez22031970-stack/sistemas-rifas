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
import { Edit } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Compra } from '@/types/database'

interface EditarCompradorDialogProps {
  compra: Compra
}

export function EditarCompradorDialog({ compra }: EditarCompradorDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    comprador_nombre: compra.comprador_nombre,
    comprador_cedula: compra.comprador_cedula,
    comprador_telefono: compra.comprador_telefono,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('compras')
        .update({
          comprador_nombre: formData.comprador_nombre,
          comprador_cedula: formData.comprador_cedula,
          comprador_telefono: formData.comprador_telefono,
        })
        .eq('id', compra.id)

      if (error) throw error

      toast.success('Datos del comprador actualizados')
      setOpen(false)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar los datos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Editar Datos
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Datos del Comprador</DialogTitle>
          <DialogDescription>
            Modifica la información del comprador
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input
                id="nombre"
                value={formData.comprador_nombre}
                onChange={(e) =>
                  setFormData({ ...formData, comprador_nombre: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula</Label>
              <Input
                id="cedula"
                value={formData.comprador_cedula}
                onChange={(e) =>
                  setFormData({ ...formData, comprador_cedula: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.comprador_telefono}
                onChange={(e) =>
                  setFormData({ ...formData, comprador_telefono: e.target.value })
                }
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

