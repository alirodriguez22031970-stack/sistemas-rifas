import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatPhoneNumber(phone: string): string {
  // Formatea número venezolano: 04141234567 -> 0414-123-4567
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

export function formatPhoneForWhatsApp(phone: string): string {
  // Formatea para WhatsApp: 04141234567 -> +584141234567
  // Asegura que siempre tenga el formato +58XXXXXXXXXX
  const cleaned = phone.replace(/\D/g, '')
  
  // Si ya tiene el +58, solo limpia y devuelve con +
  if (cleaned.startsWith('58') && cleaned.length >= 12) {
    return `+${cleaned}`
  }
  
  // Si empieza con 0 (formato venezolano local), reemplaza 0 por 58
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return `+58${cleaned.slice(1)}`
  }
  
  // Si ya tiene 58 pero sin el +, agrega el +
  if (cleaned.startsWith('58')) {
    return `+${cleaned}`
  }
  
  // Si no tiene código de país, asume que es venezolano y agrega +58
  if (cleaned.length === 10) {
    return `+58${cleaned}`
  }
  
  // Por defecto, agrega +58
  return `+58${cleaned}`
}

export function calculateProgress(vendidos: number, total: number): number {
  if (total === 0) return 0
  return Math.round((vendidos / total) * 100)
}

export function getRifaBadge(rifa: {
  numeros_vendidos: number
  total_numeros: number
  fecha_fin: string
  created_at: string
}): 'nueva' | 'casi_llena' | 'finaliza_pronto' | null {
  const progress = calculateProgress(rifa.numeros_vendidos, rifa.total_numeros)
  const fechaFin = new Date(rifa.fecha_fin)
  const ahora = new Date()
  const diasRestantes = Math.ceil((fechaFin.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24))
  const fechaCreacion = new Date(rifa.created_at)
  const diasDesdeCreacion = Math.ceil((ahora.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24))

  if (diasDesdeCreacion <= 7) {
    return 'nueva'
  }
  if (progress >= 80) {
    return 'casi_llena'
  }
  if (diasRestantes <= 3 && diasRestantes > 0) {
    return 'finaliza_pronto'
  }

  return null
}

