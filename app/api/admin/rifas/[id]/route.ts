import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar que el usuario sea admin
    await requireAdmin()

    // Usar service_role key para operaciones de admin (bypass RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Verificar que la rifa existe
    const { data: rifa, error: rifaError } = await supabase
      .from('rifas')
      .select('id, nombre')
      .eq('id', params.id)
      .single()

    if (rifaError || !rifa) {
      return NextResponse.json(
        { error: 'Rifa no encontrada' },
        { status: 404 }
      )
    }

    // Verificar si hay compras asociadas
    const { data: compras, error: comprasError } = await supabase
      .from('compras')
      .select('id')
      .eq('rifa_id', params.id)
      .limit(1)

    if (comprasError) {
      console.error('Error verificando compras:', comprasError)
    }

    // Eliminar la rifa (las relaciones CASCADE eliminarán automáticamente compras y números_vendidos)
    const { error: deleteError } = await supabase
      .from('rifas')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('Error eliminando rifa:', deleteError)
      throw deleteError
    }

    return NextResponse.json({
      success: true,
      message: 'Rifa eliminada exitosamente',
      rifa: {
        id: rifa.id,
        nombre: rifa.nombre,
      },
    })
  } catch (error: any) {
    console.error('Error eliminando rifa:', error)
    return NextResponse.json(
      { error: error.message || 'Error al eliminar la rifa' },
      { status: 500 }
    )
  }
}

