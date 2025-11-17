'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase/client'

interface AccionCompraProps {
  compraId: string
}

export function AprobarCompraButton({ compraId }: AccionCompraProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleAprobar = async () => {
    if (!confirm('¿Estás seguro de aprobar esta compra? Se generará el PDF y se enviará WhatsApp.')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/compras/${compraId}/aprobar`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al aprobar la compra')
      }

      toast.success('Compra aprobada exitosamente. PDF generado y WhatsApp enviado.')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Error al aprobar la compra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleAprobar} variant="default" size="sm" disabled={loading}>
      <CheckCircle className="h-4 w-4 mr-2" />
      {loading ? 'Aprobando...' : 'Aprobar'}
    </Button>
  )
}

export function RechazarCompraButton({ compraId }: AccionCompraProps) {
  const router = useRouter()

  const handleRechazar = async () => {
    if (!confirm('¿Estás seguro de rechazar esta compra?')) return

    try {
      const { error } = await supabase
        .from('compras')
        .update({ estado: 'rechazada' })
        .eq('id', compraId)

      if (error) throw error

      toast.success('Compra rechazada')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Error al rechazar la compra')
    }
  }

  return (
    <Button onClick={handleRechazar} variant="destructive" size="sm">
      <XCircle className="h-4 w-4 mr-2" />
      Rechazar
    </Button>
  )
}

