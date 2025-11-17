import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase environment variables' },
        { status: 500 }
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const email = 'admin@rifas.com'
    const password = 'Admin123!@#'
    const nombre = 'Administrador Principal'

    // Verificar si el usuario ya existe
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      throw listError
    }

    let adminUser = users.find(u => u.email === email)

    // Si no existe, crearlo
    if (!adminUser) {
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Confirmar email automáticamente
        user_metadata: {
          nombre,
        }
      })

      if (createError) {
        throw createError
      }

      adminUser = newUser.user
    } else {
      // Si existe, actualizar la contraseña y confirmar email
      const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        adminUser.id,
        {
          password,
          email_confirm: true,
        }
      )

      if (updateError) {
        throw updateError
      }
    }

    // Asegurar que existe en public.usuarios con rol admin
    const { error: usuarioError } = await supabaseAdmin
      .from('usuarios')
      .upsert({
        id: adminUser.id,
        email,
        nombre,
        rol: 'admin',
      }, {
        onConflict: 'id'
      })

    if (usuarioError) {
      console.error('Error actualizando usuario en tabla usuarios:', usuarioError)
      // No fallar si esto falla, el usuario ya está creado en auth
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario administrador creado/actualizado exitosamente',
      user: {
        id: adminUser.id,
        email: adminUser.email,
      },
      credentials: {
        email,
        password,
      }
    })
  } catch (error: any) {
    console.error('Error creando usuario admin:', error)
    return NextResponse.json(
      { error: error.message || 'Error al crear el usuario administrador' },
      { status: 500 }
    )
  }
}

