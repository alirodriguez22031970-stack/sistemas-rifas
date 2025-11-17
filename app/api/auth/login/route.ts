import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      )
    }

    // Cliente anónimo para autenticación
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Intentar login directamente
    const { data: authData, error: authError } = await supabaseAnon.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (authError) {
      // Manejar rate limits
      if (authError.message?.includes('rate limit') || 
          authError.message?.includes('too many') ||
          authError.message?.includes('429')) {
        // Esperar y reintentar una vez
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const retryResult = await supabaseAnon.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        })

        if (retryResult.error) {
          if (retryResult.error.message?.includes('rate limit') || 
              retryResult.error.message?.includes('too many')) {
            return NextResponse.json(
              { error: 'Demasiados intentos. Espera 2-3 minutos e intenta de nuevo.' },
              { status: 429 }
            )
          }
          
          if (retryResult.error.message?.includes('Invalid login credentials') ||
              retryResult.error.message?.includes('Invalid email or password')) {
            return NextResponse.json(
              { error: 'Email o contraseña incorrectos' },
              { status: 401 }
            )
          }
          
          return NextResponse.json(
            { error: retryResult.error.message || 'Error al iniciar sesión' },
            { status: 401 }
          )
        }

        // Login exitoso después del retry
        const finalData = retryResult.data
        if (!finalData.user || !finalData.session) {
          return NextResponse.json(
            { error: 'No se pudo crear la sesión' },
            { status: 500 }
          )
        }

        // Obtener rol del usuario
        let rol = 'usuario'
        if (supabaseServiceKey) {
          try {
            const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
              auth: { autoRefreshToken: false, persistSession: false }
            })
            const { data: usuario } = await supabaseAdmin
              .from('usuarios')
              .select('rol')
              .eq('id', finalData.user.id)
              .single()
            rol = usuario?.rol || 'usuario'
          } catch (error) {
            // Si falla, usar rol por defecto
            console.error('Error obteniendo rol:', error)
          }
        }

        return NextResponse.json({
          success: true,
          user: finalData.user,
          session: finalData.session,
          rol,
        })
      }

      // Otros errores
      if (authError.message?.includes('Invalid login credentials') || 
          authError.message?.includes('Invalid email or password')) {
        return NextResponse.json(
          { error: 'Email o contraseña incorrectos' },
          { status: 401 }
        )
      }

      return NextResponse.json(
        { error: authError.message || 'Error al iniciar sesión' },
        { status: 401 }
      )
    }

    if (!authData.user || !authData.session) {
      return NextResponse.json(
        { error: 'No se pudo crear la sesión' },
        { status: 500 }
      )
    }

    // Obtener rol del usuario
    let rol = 'usuario'
    if (supabaseServiceKey) {
      try {
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        })
        const { data: usuario } = await supabaseAdmin
          .from('usuarios')
          .select('rol')
          .eq('id', authData.user.id)
          .single()
        rol = usuario?.rol || 'usuario'
      } catch (error) {
        // Si falla, usar rol por defecto
        console.error('Error obteniendo rol:', error)
      }
    }

    return NextResponse.json({
      success: true,
      user: authData.user,
      session: authData.session,
      rol,
    })
  } catch (error: any) {
    console.error('Error en login API:', error)
    return NextResponse.json(
      { error: error.message || 'Error al iniciar sesión' },
      { status: 500 }
    )
  }
}

