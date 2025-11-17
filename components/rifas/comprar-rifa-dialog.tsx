'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CompraRifaForm } from '@/components/compras/compra-rifa-form'
import { Database } from '@/types/database'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

type Rifa = Database['public']['Tables']['rifas']['Row']

interface ComprarRifaDialogProps {
  rifa: Rifa
}

export function ComprarRifaDialog({ rifa }: ComprarRifaDialogProps) {
  const supabase = createClientComponentClient<Database>()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [numerosOcupados, setNumerosOcupados] = useState<number[]>([])

  const finalizada =
    new Date(rifa.fecha_fin) < new Date() || rifa.numeros_vendidos >= rifa.total_numeros || !rifa.activa

  useEffect(() => {
    if (!open) return

    const cargarNumeros = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('numeros_vendidos')
        .select('numero')
        .eq('rifa_id', rifa.id)

      if (error) {
        console.error('Error cargando números vendidos:', error)
        toast.error('No se pudieron cargar los números vendidos')
        setNumerosOcupados([])
      } else {
        setNumerosOcupados(data?.map((item) => item.numero) ?? [])
      }

      setLoading(false)
    }

    cargarNumeros()
  }, [open, rifa.id, supabase])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" disabled={finalizada}>
          {finalizada ? 'Rifa finalizada' : 'Comprar'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Comprar boletos</DialogTitle>
          <DialogDescription>Completa tus datos y confirma tu compra.</DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Cargando información de la rifa...
          </div>
        ) : (
          <CompraRifaForm rifa={rifa} numerosOcupados={numerosOcupados} finalizada={finalizada} />
        )}
      </DialogContent>
    </Dialog>
  )
}

