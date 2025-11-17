import { formatPhoneForWhatsApp } from './utils'
import { Database } from '@/types/database'

type Compra = Database['public']['Tables']['compras']['Row']

interface EnviarWhatsAppParams {
  compra: Compra
  rifaNombre: string
}

export async function enviarWhatsApp({ compra, rifaNombre }: EnviarWhatsAppParams): Promise<boolean> {
  const whatsappApiUrl = process.env.WHATSAPP_API_URL
  const whatsappApiToken = process.env.WHATSAPP_API_TOKEN
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  if (!whatsappApiUrl || !whatsappApiToken) {
    console.warn('WhatsApp API no configurada')
    return false
  }

  const telefono = formatPhoneForWhatsApp(compra.comprador_telefono)
  // Link para buscar tickets por cédula (más útil para el usuario)
  const linkVerificacion = `${appUrl}?cedula=${compra.comprador_cedula}`

  // Solo enviar si la compra está aprobada
  if (compra.estado !== 'aprobada') {
    console.log('Compra no aprobada, no se envía WhatsApp')
    return false
  }

  // Formatear números asignados
  const numerosFormateados = compra.numeros_asignados.length <= 10
    ? compra.numeros_asignados.join(', ')
    : `${compra.numeros_asignados.slice(0, 10).join(', ')} y ${compra.numeros_asignados.length - 10} más`

  const mensaje = `¡Hola ${compra.comprador_nombre}! 👋

🎉 ¡Excelente noticia! Tu compra ha sido *APROBADA* ✅

📋 *Detalles de tu compra:*
• Rifa: ${rifaNombre}
• Cantidad de boletos: ${compra.cantidad_boletos}
• Monto total: $${compra.monto_total}
• Estado: Aprobada ✅

🎫 *Tus números asignados:*
${numerosFormateados}

🔗 *Verifica tus números aquí:*
${linkVerificacion}

¡Gracias por participar! 🎉
¡Mucha suerte en el sorteo! 🍀`

  try {
    console.log(`Enviando WhatsApp a: ${telefono}`)
    console.log(`Mensaje: ${mensaje.substring(0, 100)}...`)

    const response = await fetch(whatsappApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${whatsappApiToken}`,
      },
      body: JSON.stringify({
        to: telefono,
        message: mensaje,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`WhatsApp API error: ${response.status} - ${errorText}`)
      throw new Error(`WhatsApp API error: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('WhatsApp enviado exitosamente:', result)
    return true
  } catch (error) {
    console.error('Error enviando WhatsApp:', error)
    return false
  }
}

