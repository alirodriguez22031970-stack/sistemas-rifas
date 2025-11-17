'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase/client'

interface ToggleVisibilidadButtonProps {
  rifaId: string
  visible: boolean
}

export function ToggleVisibilidadButton({ rifaId, visible }: ToggleVisibilidadButtonProps) {
  const router = useRouter()

  const handleToggle = async () => {
    try {
      const { error } = await supabase
        .from('rifas')
        .update({ visible: !visible })
        .eq('id', rifaId)

      if (error) throw error

      toast.success(visible ? 'Rifa ocultada' : 'Rifa visible')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Error al cambiar visibilidad')
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      title={visible ? 'Ocultar rifa' : 'Mostrar rifa'}
    >
      {visible ? (
        <Eye className="h-4 w-4" />
      ) : (
        <EyeOff className="h-4 w-4" />
      )}
    </Button>
  )
}

