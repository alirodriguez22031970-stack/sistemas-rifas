'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { Compra, Rifa } from '@/types/database'
import { descargarReciboPDF } from '@/lib/pdf-generator'
import toast from 'react-hot-toast'

interface DescargarPDFButtonProps {
  compra: Compra
  rifa: Rifa
}

export function DescargarPDFButton({ compra, rifa }: DescargarPDFButtonProps) {
  const handleDescargar = async () => {
    try {
      await descargarReciboPDF({ compra, rifa })
      toast.success('PDF descargado exitosamente')
    } catch (error: any) {
      toast.error(error.message || 'Error al generar el PDF')
    }
  }

  return (
    <Button onClick={handleDescargar} variant="outline" size="sm">
      <Download className="h-4 w-4 mr-2" />
      Descargar PDF
    </Button>
  )
}

