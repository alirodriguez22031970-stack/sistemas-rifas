import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { UserPlus, Shield, User, Search } from 'lucide-react'
import { CrearUsuarioAdminDialog } from '@/components/admin/crear-usuario-admin-dialog'
import { CambiarRolButton } from '@/components/admin/cambiar-rol-button'

export default async function UsuariosAdminPage({
  searchParams,
}: {
  searchParams: { busqueda?: string }
}) {
  const supabase = createServerSupabaseClient()

  let query = supabase
    .from('usuarios')
    .select('*')
    .order('created_at', { ascending: false })

  if (searchParams.busqueda) {
    query = query.or(`email.ilike.%${searchParams.busqueda}%,nombre.ilike.%${searchParams.busqueda}%`)
  }

  const { data: usuarios, error } = await query

  if (error) {
    console.error('Error fetching usuarios:', error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra usuarios y roles del sistema
          </p>
        </div>
        <CrearUsuarioAdminDialog />
      </div>

      {/* Búsqueda */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <form method="get" className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="busqueda"
                placeholder="Buscar por nombre o email..."
                defaultValue={searchParams.busqueda}
                className="pl-10"
              />
            </div>
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de usuarios */}
      {usuarios && usuarios.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {usuarios.map((usuario) => (
            <Card key={usuario.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      {usuario.rol === 'admin' ? (
                        <Shield className="h-6 w-6 text-primary" />
                      ) : (
                        <User className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{usuario.nombre}</h3>
                        <Badge variant={usuario.rol === 'admin' ? 'default' : 'secondary'}>
                          {usuario.rol === 'admin' ? 'Administrador' : 'Usuario'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{usuario.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Registrado: {format(new Date(usuario.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CambiarRolButton 
                      usuarioId={usuario.id} 
                      email={usuario.email}
                      rolActual={usuario.rol}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground text-lg">
              No se encontraron usuarios
            </p>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usuarios?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {usuarios?.filter(u => u.rol === 'admin').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Usuarios Regulares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usuarios?.filter(u => u.rol === 'usuario').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

