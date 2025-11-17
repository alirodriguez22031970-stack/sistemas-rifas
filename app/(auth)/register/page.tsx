'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })

      if (error) {
        // Manejo específico de errores comunes
        if (error.message.includes('already registered')) {
          toast.error('Este email ya está registrado. Intenta iniciar sesión.')
          router.push('/login')
          return
        }
        if (error.message.includes('12 seconds')) {
          toast.error('Espera unos segundos antes de intentar de nuevo. Esto es por seguridad.')
          return
        }
        throw error
      }

      if (data.user) {
        // Crear registro en tabla usuarios
        const { error: usuarioError } = await supabase
          .from('usuarios')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            nombre: nombre || data.user.email!.split('@')[0],
            rol: 'usuario',
          })

        if (usuarioError) {
          // Si falla la inserción pero el usuario se creó, intentar de nuevo
          if (usuarioError.code === '23505') {
            // Usuario ya existe en la tabla, continuar
            console.log('Usuario ya existe en tabla usuarios')
          } else if (usuarioError.message.includes('row-level security')) {
            // Error de RLS - la política no está configurada
            toast.error('Error de configuración: Ejecuta el script CORREGIR_RLS_USUARIOS.sql en Supabase')
            console.error('Error RLS:', usuarioError)
            throw new Error('Política RLS no configurada. Ejecuta CORREGIR_RLS_USUARIOS.sql en Supabase SQL Editor.')
          } else {
            throw usuarioError
          }
        }

        toast.success('Registro exitoso. Verifica tu email para confirmar tu cuenta.')
        router.push('/login')
      }
    } catch (error: any) {
      console.error('Error en registro:', error)
      const errorMessage = error.message || 'Error al registrarse'
      
      if (errorMessage.includes('rate limit') || errorMessage.includes('12 seconds')) {
        toast.error('Demasiados intentos. Espera 12 segundos antes de intentar de nuevo.')
      } else if (errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
        toast.error('Error: La base de datos no está configurada. Ejecuta el schema SQL en Supabase.')
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Crear Cuenta</CardTitle>
          <CardDescription className="text-center">
            Regístrate para comenzar a usar el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <a href="/login" className="text-primary hover:underline">
                Inicia sesión
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

