'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ResetPasswordAdminPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    credentials?: { email: string; password: string }
  } | null>(null)

  const handleReset = async () => {
    console.log('Botón clickeado, iniciando reset...')
    setLoading(true)
    setResult(null)

    try {
      console.log('Haciendo petición a /api/admin/reset-password')
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('Respuesta recibida:', response.status, response.statusText)
      
      const data = await response.json()
      console.log('Datos recibidos:', data)

      if (response.ok && data.success) {
        setResult({
          success: true,
          message: 'Contraseña reseteada exitosamente',
          credentials: data.credentials,
        })
      } else {
        setResult({
          success: false,
          message: data.error || 'Error desconocido',
        })
      }
    } catch (error: any) {
      console.error('Error en handleReset:', error)
      setResult({
        success: false,
        message: error.message || 'Error al resetear la contraseña. Revisa la consola para más detalles.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">🔐 Resetear Contraseña Admin</CardTitle>
          <CardDescription className="text-center">
            Resetea la contraseña del usuario administrador
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Este script reseteará la contraseña del usuario <strong>admin@sistema-rifas.com</strong> a: <strong>Admin123!@#</strong>
          </p>

          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              console.log('Botón clickeado')
              handleReset()
            }}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Reseteando...' : 'Resetear Contraseña'}
          </Button>

          {result && (
            <div className={`p-4 rounded-lg ${
              result.success 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <h3 className={`font-bold mb-2 ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                {result.success ? '✅ Éxito' : '❌ Error'}
              </h3>
              <p className="text-sm mb-2">{result.message}</p>
              
              {result.success && result.credentials && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                  <strong className="block mb-2">Credenciales actualizadas:</strong>
                  <p><strong>Email:</strong> {result.credentials.email}</p>
                  <p><strong>Contraseña:</strong> {result.credentials.password}</p>
                </div>
              )}

              {result.success && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
                  <strong>⚠️ Importante:</strong> Espera 5 minutos antes de intentar hacer login para que se libere el rate limit de Supabase.
                </div>
              )}
            </div>
          )}

          <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
            <strong>Nota:</strong> Si este método no funciona, puedes resetear la contraseña manualmente desde Supabase Dashboard → Authentication → Users
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

