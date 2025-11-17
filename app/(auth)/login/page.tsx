'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  // Lazy initialization: solo crear cliente cuando se necesite
  const [supabase] = useState(() => createClientComponentClient())
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    try {
      const emailLimpio = email.trim().toLowerCase()
      
      console.log('Intentando login con:', emailLimpio)
      
      // Usar API route que maneja rate limits mejor
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailLimpio,
          password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || 'Error al iniciar sesión')
        setLoading(false)
        return
      }

      if (!result.user || !result.session) {
        toast.error('No se pudo obtener la información del usuario')
        setLoading(false)
        return
      }

      console.log('Login exitoso, usuario ID:', result.user.id)

      // Establecer la sesión en el cliente de Supabase
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: result.session.access_token,
        refresh_token: result.session.refresh_token,
      })

      if (sessionError) {
        console.error('Error estableciendo sesión:', sessionError)
        toast.error('Error al establecer la sesión. Intenta de nuevo.')
        setLoading(false)
        return
      }

      // Verificar que la sesión se estableció correctamente
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      
      if (!currentSession) {
        console.error('No se pudo verificar la sesión')
        toast.error('Error al verificar la sesión. Intenta de nuevo.')
        setLoading(false)
        return
      }

      const rol = result.rol || 'usuario'
      const destino = rol === 'admin' ? '/dashboard' : '/'

      toast.success('Bienvenido')
      
      // Esperar un momento para que la sesión se establezca completamente
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Redirigir usando window.location para forzar recarga completa
      window.location.href = destino
    } catch (err: any) {
      console.error('Error al iniciar sesión:', err)
      toast.error(err?.message || 'No se pudo iniciar sesión. Inténtalo nuevamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@rifas.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Problemas para iniciar sesión?
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Si ves un mensaje de "demasiados intentos", espera 2-3 minutos e intenta de nuevo.
              El sistema reintentará automáticamente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

