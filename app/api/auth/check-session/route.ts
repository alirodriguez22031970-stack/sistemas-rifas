import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ authenticated: false }, { status: 200 })
    }

    // Obtener información del usuario
    const { data: usuario, error: usuarioError } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', session.user.id)
      .single()

    if (usuarioError) {
      return NextResponse.json({ authenticated: false }, { status: 200 })
    }

    return NextResponse.json({
      authenticated: true,
      rol: usuario?.rol || 'usuario',
      userId: session.user.id,
    })
  } catch (error) {
    console.error('Error verificando sesión:', error)
    return NextResponse.json({ authenticated: false }, { status: 200 })
  }
}

