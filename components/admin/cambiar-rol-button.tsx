'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Shield, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase/client'

interface CambiarRolButtonProps {
  usuarioId: string
  email: string
  rolActual: 'admin' | 'usuario'
}

export function CambiarRolButton({ usuarioId, email, rolActual }: CambiarRolButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const nuevoRol = rolActual === 'admin' ? 'usuario' : 'admin'

  const handleCambiarRol = async () => {
    const confirmar = window.confirm(
      `¿Estás seguro de cambiar el rol de ${email} de "${rolActual}" a "${nuevoRol}"?`
    )

    if (!confirmar) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ rol: nuevoRol })
        .eq('id', usuarioId)

      if (error) throw error

      toast.success(`Rol cambiado a ${nuevoRol === 'admin' ? 'Administrador' : 'Usuario'}`)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Error al cambiar el rol')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCambiarRol}
      variant={rolActual === 'admin' ? 'outline' : 'default'}
      size="sm"
      disabled={loading}
    >
      {rolActual === 'admin' ? (
        <>
          <User className="h-4 w-4 mr-2" />
          {loading ? 'Cambiando...' : 'Quitar Admin'}
        </>
      ) : (
        <>
          <Shield className="h-4 w-4 mr-2" />
          {loading ? 'Cambiando...' : 'Hacer Admin'}
        </>
      )}
    </Button>
  )
}

