import { createServerSupabaseClient } from '@/lib/supabase/server'
import { RifaCard } from '@/components/rifas/rifa-card'
import { getCurrentUser } from '@/lib/auth'
import { Navbar } from '@/components/layout/navbar'

export default async function RifasPage() {
  const supabase = createServerSupabaseClient()
  const user = await getCurrentUser()
  const isAdmin = user?.rol === 'admin'

  // Si es admin, ver todas las rifas. Si no, solo las visibles
  const query = supabase
    .from('rifas')
    .select('*')
    .eq('activa', true)
    .order('created_at', { ascending: false })

  if (!isAdmin) {
    query.eq('visible', true)
  }

  const { data: rifas, error } = await query

  if (error) {
    console.error('Error fetching rifas:', error)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Rifas Disponibles</h1>
          <p className="text-muted-foreground">
            Participa en nuestras rifas y gana increíbles premios
          </p>
        </div>

        {rifas && rifas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rifas.map((rifa) => (
              <RifaCard key={rifa.id} rifa={rifa} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No hay rifas disponibles en este momento
            </p>
          </div>
        )}
      </div>
      </div>
    </>
  )
}

