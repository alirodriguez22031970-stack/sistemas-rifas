import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    // Verificar que el usuario sea admin (mismo patrón que otras rutas)
    await requireAdmin()
    
    const formData = await request.formData()
    
    // Usar service_role key para bypass RLS (mismo patrón que otras rutas)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      )
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Extraer datos del formulario
    const nombre = formData.get('nombre') as string
    const descripcion = formData.get('descripcion') as string | null
    const precio = formData.get('precio') as string
    const fecha_inicio = formData.get('fecha_inicio') as string
    const fecha_fin = formData.get('fecha_fin') as string
    const total_numeros = formData.get('total_numeros') as string
    const visible = formData.get('visible') === 'true'
    const imagenFile = formData.get('imagen') as File | null

    // Validar datos requeridos
    if (!nombre || !precio || !fecha_inicio || !fecha_fin || !total_numeros) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Subir imagen si existe (usando service_role key para bypass RLS)
    let imagenUrl: string | null = null
    if (imagenFile && imagenFile.size > 0) {
      try {
        const fileExt = imagenFile.name.split('.').pop()
        const fileName = `rifas/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        
        // Convertir File a ArrayBuffer para subir
        const arrayBuffer = await imagenFile.arrayBuffer()
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('rifas-imagenes')
          .upload(fileName, arrayBuffer, {
            contentType: imagenFile.type,
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('Error subiendo imagen:', uploadError)
          return NextResponse.json(
            { error: `Error al subir la imagen: ${uploadError.message}` },
            { status: 500 }
          )
        }

        // Obtener URL pública
        const { data: urlData } = supabaseAdmin.storage
          .from('rifas-imagenes')
          .getPublicUrl(fileName)

        if (!urlData?.publicUrl) {
          return NextResponse.json(
            { error: 'No se pudo obtener la URL de la imagen' },
            { status: 500 }
          )
        }

        imagenUrl = urlData.publicUrl
      } catch (imageError: any) {
        console.error('Error procesando imagen:', imageError)
        return NextResponse.json(
          { error: `Error al procesar la imagen: ${imageError.message}` },
          { status: 500 }
        )
      }
    }

    // Crear la rifa usando service_role key (bypass RLS completamente)
    const { data: rifa, error: insertError } = await supabaseAdmin
      .from('rifas')
      .insert({
        nombre,
        descripcion: descripcion || null,
        precio: Number(precio),
        fecha_inicio: new Date(fecha_inicio).toISOString(),
        fecha_fin: new Date(fecha_fin).toISOString(),
        total_numeros: Number(total_numeros),
        numeros_vendidos: 0,
        visible,
        activa: true,
        imagen_url: imagenUrl,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creando rifa:', insertError)
      console.error('Detalles del error:', JSON.stringify(insertError, null, 2))
      return NextResponse.json(
        { error: insertError.message || 'Error al crear la rifa' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, rifa })
  } catch (error: any) {
    console.error('Error en POST /api/admin/rifas:', error)
    return NextResponse.json(
      { error: error.message || 'Error al crear la rifa' },
      { status: 500 }
    )
  }
}

