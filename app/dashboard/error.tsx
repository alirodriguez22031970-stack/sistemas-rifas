'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Error de Acceso</CardTitle>
          <CardDescription>
            No tienes permisos para acceder a esta sección
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {error.message || 'Debes iniciar sesión como administrador para acceder al dashboard.'}
          </p>
          <div className="flex gap-2">
            <Button onClick={() => router.push('/login')} className="flex-1">
              Ir a Iniciar Sesión
            </Button>
            <Button onClick={reset} variant="outline" className="flex-1">
              Intentar de Nuevo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

