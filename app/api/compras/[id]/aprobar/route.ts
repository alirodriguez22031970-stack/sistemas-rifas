import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { generarReciboPDF } from '@/lib/pdf-generator'
import { enviarWhatsApp } from '@/lib/whatsapp'
import { createClient } from '@supabase/supabase-js'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    // Obtener compra
    const { data: compra, error: compraError } = await supabase
      .from('compras')
      .select('*')
      .eq('id', params.id)
      .single()

    if (compraError || !compra) {
      return NextResponse.json(
        { error: 'Compra no encontrada' },
        { status: 404 }
      )
    }

    if (compra.estado === 'aprobada') {
      return NextResponse.json(
        { error: 'La compra ya está aprobada' },
        { status: 400 }
      )
    }

    // Obtener rifa
    const { data: rifa, error: rifaError } = await supabase
      .from('rifas')
      .select('*')
      .eq('id', compra.rifa_id)
      .single()

    if (rifaError || !rifa) {
      return NextResponse.json(
        { error: 'Rifa no encontrada' },
        { status: 404 }
      )
    }

    // Verificar disponibilidad de números
    const { data: numerosOcupados } = await supabase
      .from('numeros_vendidos')
      .select('numero')
      .eq('rifa_id', rifa.id)

    const numerosOcupadosList = numerosOcupados?.map((n: { numero: number }) => n.numero) || []
    const numerosConflictivos = compra.numeros_asignados.filter((n: number) => numerosOcupadosList.includes(n))

    if (numerosConflictivos.length > 0) {
      return NextResponse.json(
        { error: `Los números ${numerosConflictivos.join(', ')} ya están ocupados` },
        { status: 400 }
      )
    }

    // Actualizar compra
    const { error: updateError } = await supabase
      .from('compras')
      .update({ estado: 'aprobada' })
      .eq('id', params.id)

    if (updateError) {
      throw updateError
    }

    // Generar PDF
    try {
      const pdfBlob = await generarReciboPDF({ compra: { ...compra, estado: 'aprobada' }, rifa })
      
      // Subir PDF a Supabase Storage (opcional)
      const fileName = `recibos/${params.id}.pdf`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recibos')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          upsert: true,
        })

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage
          .from('recibos')
          .getPublicUrl(fileName)

        if (urlData) {
          await supabase
            .from('compras')
            .update({ pdf_url: urlData.publicUrl })
            .eq('id', params.id)
        }
      }
    } catch (pdfError) {
      console.error('Error generando PDF:', pdfError)
      // No fallar la aprobación si el PDF falla
    }

    // Enviar WhatsApp
    try {
      await enviarWhatsApp({
        compra: { ...compra, estado: 'aprobada' },
        rifaNombre: rifa.nombre,
      })

      await supabase
        .from('compras')
        .update({ whatsapp_enviado: true })
        .eq('id', params.id)
    } catch (whatsappError) {
      console.error('Error enviando WhatsApp:', whatsappError)
      // No fallar la aprobación si WhatsApp falla
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error aprobando compra:', error)
    return NextResponse.json(
      { error: error.message || 'Error al aprobar la compra' },
      { status: 500 }
    )
  }
}

