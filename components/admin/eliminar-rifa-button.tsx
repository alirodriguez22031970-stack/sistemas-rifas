'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface EliminarRifaButtonProps {
  rifaId: string
  rifaNombre: string
}

export function EliminarRifaButton({ rifaId, rifaNombre }: EliminarRifaButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/rifas/${rifaId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar la rifa')
      }

      toast.success('Rifa eliminada exitosamente')
      setOpen(false)
      router.refresh()
    } catch (error: any) {
      console.error('Error eliminando rifa:', error)
      toast.error(error.message || 'Error al eliminar la rifa')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" title="Eliminar rifa">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar rifa?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente la rifa{' '}
            <strong>&quot;{rifaNombre}&quot;</strong> y todos sus datos relacionados
            (compras, números vendidos, etc.).
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

