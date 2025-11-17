import jsPDF from 'jspdf'
import { Compra, Rifa } from '@/types/database'
import { formatCurrency, formatPhoneNumber } from './utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface GenerarReciboParams {
  compra: Compra
  rifa: Rifa
}

export async function generarReciboPDF({ compra, rifa }: GenerarReciboParams): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  let yPosition = margin

  // Función para agregar nueva página si es necesario
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
      return true
    }
    return false
  }

  // Encabezado
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('RECIBO DE COMPRA', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 10

  // Línea divisoria
  doc.setLineWidth(0.5)
  doc.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 10

  // Información de la rifa
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Rifa:', margin, yPosition)
  yPosition += 7

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(rifa.nombre, margin, yPosition)
  yPosition += 6

  if (rifa.descripcion) {
    doc.setFontSize(10)
    doc.text(rifa.descripcion, margin, yPosition, {
      maxWidth: pageWidth - 2 * margin,
    })
    yPosition += 8
  }

  yPosition += 5

  // Información del comprador
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Datos del Comprador:', margin, yPosition)
  yPosition += 7

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  const datosComprador = [
    `Nombre: ${compra.comprador_nombre}`,
    `Cédula: ${compra.comprador_cedula}`,
    `Teléfono: ${formatPhoneNumber(compra.comprador_telefono)}`,
  ]

  datosComprador.forEach((line) => {
    checkNewPage(7)
    doc.text(line, margin, yPosition)
    yPosition += 7
  })

  yPosition += 5

  // Información de pago
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Información de Pago:', margin, yPosition)
  yPosition += 7

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  const metodoPagoLabels: Record<string, string> = {
    pago_movil: 'Pago Móvil',
    zelle: 'Zelle',
    transferencia: 'Transferencia Bancaria',
  }

  const datosPago = [
    `Método de Pago: ${metodoPagoLabels[compra.metodo_pago] || compra.metodo_pago}`,
    compra.referencia_pago ? `Referencia: ${compra.referencia_pago}` : null,
    `Cantidad de Boletos: ${compra.cantidad_boletos}`,
    `Precio por Boleto: ${formatCurrency(rifa.precio)}`,
    `Total Pagado: ${formatCurrency(compra.monto_total)}`,
  ].filter(Boolean) as string[]

  datosPago.forEach((line) => {
    checkNewPage(7)
    doc.text(line, margin, yPosition)
    yPosition += 7
  })

  yPosition += 5

  // Fecha
  doc.setFontSize(10)
  doc.text(
    `Fecha de Compra: ${format(new Date(compra.created_at), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}`,
    margin,
    yPosition
  )
  yPosition += 10

  // Estado
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  const estadoLabels: Record<string, string> = {
    pendiente: 'PENDIENTE DE APROBACIÓN',
    aprobada: 'APROBADA',
    rechazada: 'RECHAZADA',
  }
  doc.text(`Estado: ${estadoLabels[compra.estado] || compra.estado}`, margin, yPosition)
  yPosition += 10

  // Nueva página para números
  doc.addPage()
  yPosition = margin

  // Título de números
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Números Asignados', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 10

  // Línea divisoria
  doc.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 10

  // Números en cuadrícula
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const numerosPorFila = 8
  const anchoCelda = (pageWidth - 2 * margin) / numerosPorFila
  const altoCelda = 8
  let xPosition = margin

  compra.numeros_asignados.forEach((numero, index) => {
    if (index > 0 && index % numerosPorFila === 0) {
      yPosition += altoCelda
      xPosition = margin
      checkNewPage(altoCelda + 5)
    }

    // Dibujar celda
    doc.rect(xPosition, yPosition - 5, anchoCelda - 2, altoCelda, 'S')
    doc.text(numero.toString(), xPosition + anchoCelda / 2 - 2, yPosition, {
      align: 'center',
    })

    xPosition += anchoCelda
  })

  // Pie de página
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
    doc.text(
      `Compra ID: ${compra.id.slice(0, 8)}`,
      margin,
      pageHeight - 10
    )
  }

  // Generar blob
  const pdfBlob = doc.output('blob')
  return pdfBlob
}

export async function descargarReciboPDF(params: GenerarReciboParams): Promise<void> {
  const blob = await generarReciboPDF(params)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `recibo-${params.compra.id.slice(0, 8)}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

