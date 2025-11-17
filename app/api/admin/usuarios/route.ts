import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    
    const body = await request.json()
    const { email, password, nombre, rol } = body

    if (!email || !password || !nombre || !rol) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Usar service_role para crear usuarios
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Crear usuario en auth.users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      // Si el usuario ya existe, obtenerlo
      if (authError.message.includes('already registered')) {
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
        const existingUser = users.find(u => u.email === email)

        if (existingUser) {
          // Actualizar en tabla usuarios
          const { error: usuarioError } = await supabaseAdmin
            .from('usuarios')
            .upsert({
              id: existingUser.id,
              email,
              nombre,
              rol,
            })

          if (usuarioError) {
            throw usuarioError
          }

          return NextResponse.json({ 
            success: true,
            message: 'Usuario actualizado exitosamente',
            user: { id: existingUser.id, email, nombre, rol }
          })
        }
      }
      throw authError
    }

    if (!authData.user) {
      throw new Error('No se pudo crear el usuario')
    }

    // Crear registro en tabla usuarios
    const { error: usuarioError } = await supabaseAdmin
      .from('usuarios')
      .insert({
        id: authData.user.id,
        email,
        nombre,
        rol,
      })

    if (usuarioError) {
      // Si falla por conflicto, actualizar
      if (usuarioError.code === '23505') {
        await supabaseAdmin
          .from('usuarios')
          .update({ nombre, rol })
          .eq('id', authData.user.id)
      } else {
        throw usuarioError
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario creado exitosamente',
      user: { id: authData.user.id, email, nombre, rol }
    })
  } catch (error: any) {
    console.error('Error creando usuario:', error)
    return NextResponse.json(
      { error: error.message || 'Error al crear el usuario' },
      { status: 500 }
    )
  }
}

