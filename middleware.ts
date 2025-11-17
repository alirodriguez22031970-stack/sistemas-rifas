import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Solo procesar middleware para rutas que lo necesitan
  const pathname = req.nextUrl.pathname
  
  // Si es una ruta estática o de API, no procesar
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp)$/)
  ) {
    return res
  }

  // Para la página principal, permitir acceso directo sin verificaciones
  if (pathname === '/') {
    return res
  }
  
  try {
    // Optimización: solo crear cliente y obtener sesión si es necesario
    let session: any = null
    let sessionError: any = null
    let supabase: any = null
    
    // Solo crear cliente y obtener sesión si necesitamos proteger rutas o verificar login
    if (pathname.startsWith('/dashboard') || pathname === '/login') {
      supabase = createMiddlewareClient({ req, res })
      const sessionResult = await supabase.auth.getSession()
      session = sessionResult.data?.session
      sessionError = sessionResult.error
    }

    // Proteger rutas del dashboard
    if (pathname.startsWith('/dashboard')) {
      if (sessionError || !session) {
        return NextResponse.redirect(new URL('/login', req.url))
      }

      // Verificar que el usuario tenga rol de admin
      try {
        const { data: usuario } = await supabase
          .from('usuarios')
          .select('rol')
          .eq('id', session.user.id)
          .single()

        if (!usuario || usuario.rol !== 'admin') {
          return NextResponse.redirect(new URL('/', req.url))
        }
      } catch (error) {
        // Error silencioso para no ralentizar
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    // Si el usuario está autenticado y va a /login, redirigir al dashboard si es admin
    // Optimización: solo verificar si hay sesión válida
    if (pathname === '/login') {
      // Si no hay sesión, permitir acceso directo sin consultas a la base de datos
      if (!session || sessionError || !session.user) {
        return res
      }
      
      // Solo verificar rol si hay sesión válida y tenemos el cliente
      if (supabase) {
        try {
          const { data: usuario, error: usuarioError } = await supabase
            .from('usuarios')
            .select('rol')
            .eq('id', session.user.id)
            .single()
          
          // Solo redirigir si es admin
          if (!usuarioError && usuario && usuario.rol === 'admin') {
            return NextResponse.redirect(new URL('/dashboard', req.url))
          }
        } catch (error) {
          // Si hay error, no redirigir - dejar que el usuario intente hacer login
          // No loguear errores para evitar ruido en producción
        }
      }
      
      // Si llegamos aquí, permitir acceso a /login
      return res
    }
  } catch (error) {
    console.error('Error en middleware:', error)
    // Si hay un error crítico, permitir que la solicitud continúe
    // para evitar bucles de redirección
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

