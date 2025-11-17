import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LogOut, Home, ShoppingCart, BarChart3, Settings, Ticket } from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verificación estricta de autenticación
  let user
  
  try {
    const supabase = createServerSupabaseClient()
    
    // Primera verificación: sesión de Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Error obteniendo sesión:', sessionError)
      redirect('/login')
    }
    
    if (!session || !session.user) {
      redirect('/login')
    }

    // Segunda verificación: usuario en la tabla
    user = await getCurrentUser()
    
    if (!user) {
      console.error('Usuario no encontrado en tabla usuarios')
      redirect('/login')
    }

    // Tercera verificación: rol de administrador
    if (user.rol !== 'admin') {
      redirect('/rifas')
    }
  } catch (error) {
    console.error('Error en DashboardLayout:', error)
    redirect('/login')
  }

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between h-auto md:h-16 py-3 md:py-0">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <Link href="/dashboard" className="text-lg md:text-xl font-bold text-primary">
                Sistema de Rifas
              </Link>
              <div className="flex flex-wrap gap-2 md:gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-xs md:text-sm">
                    <BarChart3 className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                    <span className="hidden md:inline">Dashboard</span>
                  </Button>
                </Link>
                <Link href="/dashboard/rifas">
                  <Button variant="ghost" size="sm" className="text-xs md:text-sm">
                    <Ticket className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                    <span className="hidden md:inline">Rifas</span>
                  </Button>
                </Link>
                <Link href="/dashboard/compras">
                  <Button variant="ghost" size="sm" className="text-xs md:text-sm">
                    <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                    <span className="hidden md:inline">Compras</span>
                  </Button>
                </Link>
                <Link href="/dashboard/estadisticas">
                  <Button variant="ghost" size="sm" className="text-xs md:text-sm">
                    <BarChart3 className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                    <span className="hidden md:inline">Estadísticas</span>
                  </Button>
                </Link>
                <Link href="/dashboard/usuarios">
                  <Button variant="ghost" size="sm" className="text-xs md:text-sm">
                    <Settings className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                    <span className="hidden md:inline">Usuarios</span>
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4 mt-3 md:mt-0">
              <span className="text-xs md:text-sm text-muted-foreground truncate max-w-[100px] md:max-w-none">{user.nombre}</span>
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-xs md:text-sm">
                  <Home className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                  <span className="hidden md:inline">Ver Rifas</span>
                </Button>
              </Link>
              <form action="/api/auth/logout" method="post">
                <Button type="submit" variant="ghost" size="sm" className="text-xs md:text-sm">
                  <LogOut className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                  <span className="hidden md:inline">Salir</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}

