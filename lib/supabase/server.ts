import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const createServerSupabaseClient = () => {
  // Usar createServerComponentClient que maneja cookies automáticamente
  // y sincroniza con createClientComponentClient del cliente
  try {
    return createServerComponentClient({ cookies })
  } catch (error) {
    // Fallback solo si hay un error crítico
    console.error('Error creando cliente de servidor, usando fallback:', error)
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }

    // Crear cliente básico sin manejo de cookies (último recurso)
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  }
}

