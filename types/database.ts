export type Database = {
  public: {
    Tables: {
      rifas: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          precio: number
          fecha_inicio: string
          fecha_fin: string
          total_numeros: number
          numeros_vendidos: number
          imagen_url: string | null
          imagenes: string[] | null
          visible: boolean
          activa: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          precio: number
          fecha_inicio: string
          fecha_fin: string
          total_numeros: number
          numeros_vendidos?: number
          imagen_url?: string | null
          imagenes?: string[] | null
          visible?: boolean
          activa?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          precio?: number
          fecha_inicio?: string
          fecha_fin?: string
          total_numeros?: number
          numeros_vendidos?: number
          imagen_url?: string | null
          imagenes?: string[] | null
          visible?: boolean
          activa?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      compras: {
        Row: {
          id: string
          rifa_id: string
          comprador_nombre: string
          comprador_cedula: string
          comprador_telefono: string
          metodo_pago: 'pago_movil' | 'zelle' | 'transferencia'
          referencia_pago: string | null
          monto_total: number
          cantidad_boletos: number
          numeros_asignados: number[]
          estado: 'pendiente' | 'aprobada' | 'rechazada'
          pdf_url: string | null
          whatsapp_enviado: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          rifa_id: string
          comprador_nombre: string
          comprador_cedula: string
          comprador_telefono: string
          metodo_pago: 'pago_movil' | 'zelle' | 'transferencia'
          referencia_pago?: string | null
          monto_total: number
          cantidad_boletos: number
          numeros_asignados: number[]
          estado?: 'pendiente' | 'aprobada' | 'rechazada'
          pdf_url?: string | null
          whatsapp_enviado?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          rifa_id?: string
          comprador_nombre?: string
          comprador_cedula?: string
          comprador_telefono?: string
          metodo_pago?: 'pago_movil' | 'zelle' | 'transferencia'
          referencia_pago?: string | null
          monto_total?: number
          cantidad_boletos?: number
          numeros_asignados?: number[]
          estado?: 'pendiente' | 'aprobada' | 'rechazada'
          pdf_url?: string | null
          whatsapp_enviado?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      numeros_vendidos: {
        Row: {
          id: string
          rifa_id: string
          numero: number
          compra_id: string
          created_at: string
        }
        Insert: {
          id?: string
          rifa_id: string
          numero: number
          compra_id: string
          created_at?: string
        }
        Update: {
          id?: string
          rifa_id?: string
          numero?: number
          compra_id?: string
          created_at?: string
        }
      }
      usuarios: {
        Row: {
          id: string
          email: string
          nombre: string
          rol: 'admin' | 'usuario'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          nombre: string
          rol?: 'admin' | 'usuario'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nombre?: string
          rol?: 'admin' | 'usuario'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Rifa = Database['public']['Tables']['rifas']['Row']
export type Compra = Database['public']['Tables']['compras']['Row']
export type NumeroVendido = Database['public']['Tables']['numeros_vendidos']['Row']
export type Usuario = Database['public']['Tables']['usuarios']['Row']

export type MetodoPago = 'pago_movil' | 'zelle' | 'transferencia'
export type EstadoCompra = 'pendiente' | 'aprobada' | 'rechazada'
export type RolUsuario = 'admin' | 'usuario'

