import { createServerSupabaseClient } from './supabase/server'
import { Database } from '@/types/database'

type Usuario = Database['public']['Tables']['usuarios']['Row']

export async function getCurrentUser(): Promise<Usuario | null> {
  try {
    const supabase = createServerSupabaseClient()
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Error obteniendo sesión:', sessionError)
      return null
    }
    
    if (!session || !session.user) {
      return null
    }

    // Usar select específico en lugar de * para mejorar rendimiento
    const { data: usuario, error: usuarioError } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol, created_at')
      .eq('id', session.user.id)
      .single()

    if (usuarioError) {
      console.error('Error obteniendo usuario:', usuarioError)
      return null
    }

    return usuario as Usuario
  } catch (error) {
    console.error('Error en getCurrentUser:', error)
    return null
  }
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false
  return user.rol === 'admin'
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('No autenticado')
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.rol !== 'admin') {
    throw new Error('Acceso denegado: se requiere rol de administrador')
  }
  return user
}

