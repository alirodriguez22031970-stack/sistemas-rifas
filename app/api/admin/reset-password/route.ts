import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  console.log('Endpoint /api/admin/reset-password llamado')
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    console.log('Variables de entorno:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseServiceKey,
    })

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Faltan variables de entorno')
      return NextResponse.json(
        { error: 'Missing Supabase environment variables. Verifica .env.local' },
        { status: 500 }
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Buscar el usuario admin
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      throw listError
    }

    const adminUser = users.find(u => u.email === 'admin@sistema-rifas.com')

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Usuario admin@sistema-rifas.com no encontrado' },
        { status: 404 }
      )
    }

    // Resetear la contraseña a: Admin123!@#
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      adminUser.id,
      {
        password: 'Admin123!@#',
        email_confirm: true, // Confirmar email también
      }
    )

    if (error) {
      throw error
    }

    // Asegurar que existe en public.usuarios con rol admin
    const { error: usuarioError } = await supabaseAdmin
      .from('usuarios')
      .upsert({
        id: adminUser.id,
        email: 'admin@sistema-rifas.com',
        nombre: 'Administrador Principal',
        rol: 'admin',
      })

    if (usuarioError) {
      console.error('Error actualizando usuario en tabla usuarios:', usuarioError)
      // No fallar si esto falla, la contraseña ya se reseteó
    }

    return NextResponse.json({
      success: true,
      message: 'Contraseña reseteada exitosamente',
      user: {
        id: adminUser.id,
        email: adminUser.email,
      },
      credentials: {
        email: 'admin@sistema-rifas.com',
        password: 'Admin123!@#',
      }
    })
  } catch (error: any) {
    console.error('Error reseteando contraseña:', error)
    return NextResponse.json(
      { error: error.message || 'Error al resetear la contraseña' },
      { status: 500 }
    )
  }
}

