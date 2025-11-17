import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import { Navbar } from '@/components/layout/navbar'
import { ComprarRifaDialog } from '@/components/rifas/comprar-rifa-dialog'
import { BuscarTicketsPorCedula } from '@/components/compras/buscar-tickets-cedula'
import { formatCurrency, calculateProgress } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Suspense } from 'react'

export default async function Home() {
  const supabase = createServerSupabaseClient()
  
  // PRIMERO: Consultar rifas (esto debe funcionar para todos, incluyendo anónimos)
  let rifasActivas: any[] = []
  let debugInfo: { error?: any; rifasCount?: number; queryResult?: any } = {}

  try {
    const { data: rifas, error } = await supabase
      .from('rifas')
      .select('*')
      .eq('activa', true)
      .eq('visible', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error obteniendo rifas:', error)
      console.error('Código:', error.code)
      console.error('Mensaje:', error.message)
      console.error('Detalles:', error.details)
      console.error('Hint:', error.hint)
      debugInfo.error = {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      }
      rifasActivas = []
    } else {
      rifasActivas = rifas || []
      rifasActivas = rifasActivas.filter((rifa) => rifa.activa && rifa.visible)
      console.log(`✅ Rifas encontradas: ${rifasActivas.length}`)
      if (rifasActivas.length > 0) {
        console.log('Rifas:', rifasActivas.map(r => ({ id: r.id, nombre: r.nombre, activa: r.activa, visible: r.visible })))
      }
      debugInfo.rifasCount = rifasActivas.length
      debugInfo.queryResult = 'success'
    }
  } catch (error) {
    console.error('❌ Error consultando rifas:', error)
    debugInfo.error = error instanceof Error ? error.message : String(error)
    rifasActivas = []
  }

  // SEGUNDO: Verificar si es admin y redirigir (FUERA del try-catch para que redirect funcione)
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user) {
      try {
        const user = await getCurrentUser()
        if (user?.rol === 'admin') {
          // redirect() lanza un error especial que Next.js maneja
          // NO debe estar dentro de un try-catch
          redirect('/dashboard')
        }
      } catch (error) {
        // Si falla obtener usuario, continuar sin redirigir
        console.error('Error obteniendo usuario:', error)
      }
    }
  } catch (error) {
    // Ignorar errores de redirect - Next.js los maneja
    if (error && typeof error === 'object' && 'digest' in error && String(error.digest).includes('NEXT_REDIRECT')) {
      throw error // Re-lanzar redirect
    }
    console.error('Error verificando sesión:', error)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:gap-12 px-4 py-6 sm:py-12">
          <section className="flex flex-col gap-6">
            <article className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg">
              <header className="space-y-2">
                <p className="text-xs sm:text-sm font-semibold uppercase text-slate-500">Pago móvil</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Datos para transferir</h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Realiza el pago y luego completa el formulario para registrar tu compra.
                </p>
              </header>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="rounded-xl bg-slate-50 p-3 sm:p-4">
                  <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-500">Banco</p>
                  <p className="text-base sm:text-lg font-bold text-slate-800">Banco de Venezuela</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 sm:p-4">
                  <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-500">Cédula</p>
                  <p className="text-base sm:text-lg font-bold text-slate-800">11.102.916</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 sm:p-4">
                  <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-500">Teléfono</p>
                  <p className="text-base sm:text-lg font-bold text-slate-800">0412-9411669</p>
                </div>
              </div>
              <footer className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Guarda el comprobante para adjuntarlo al momento de registrar tu compra.
                </p>
                <Link href="/rifas" className="w-full sm:w-auto">
                  <span className="inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500">
                    Ver todas las rifas
                  </span>
                </Link>
              </footer>
            </article>
            <Suspense fallback={<div className="text-center py-4">Cargando búsqueda...</div>}>
              <BuscarTicketsPorCedula />
            </Suspense>
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Rifas disponibles</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Cada boleto asigna números aleatorios automáticamente para garantizar transparencia.
              </p>
            </div>

            {rifasActivas.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="text-slate-500 mb-2">Aún no hay rifas activas disponibles.</p>
                <p className="text-xs text-slate-400 mb-4">
                  Las rifas aparecerán aquí cuando estén activas y visibles.
                </p>
                {process.env.NODE_ENV === 'development' && debugInfo.error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                    <p className="text-xs font-semibold text-red-800 mb-2">⚠️ Error de consulta:</p>
                    <pre className="text-xs text-red-600 overflow-auto max-h-40">
                      {JSON.stringify(debugInfo.error, null, 2)}
                    </pre>
                    <p className="text-xs text-red-600 mt-2">
                      💡 Verifica las políticas RLS en Supabase ejecutando el script: <code className="bg-red-100 px-1 rounded">CORREGIR_RLS_RIFAS_PUBLICAS.sql</code>
                    </p>
                  </div>
                )}
                {process.env.NODE_ENV === 'development' && !debugInfo.error && debugInfo.rifasCount === 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
                    <p className="text-xs font-semibold text-yellow-800 mb-2">ℹ️ Información de depuración:</p>
                    <p className="text-xs text-yellow-700">
                      • Consulta ejecutada correctamente<br/>
                      • Rifas encontradas: {debugInfo.rifasCount || 0}<br/>
                      • Verifica en Supabase que haya rifas con <code className="bg-yellow-100 px-1 rounded">activa = true</code> y <code className="bg-yellow-100 px-1 rounded">visible = true</code>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {rifasActivas.map((rifa) => {
                  const progreso = calculateProgress(rifa.numeros_vendidos, rifa.total_numeros)
                  const finalizada = new Date(rifa.fecha_fin) < new Date() || rifa.numeros_vendidos >= rifa.total_numeros

                  return (
                    <article key={rifa.id} className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
                      <div className="relative h-48 w-full bg-gradient-to-br from-indigo-500 to-purple-500">
                        {rifa.imagen_url && (
                          <Image src={rifa.imagen_url} alt={rifa.nombre} fill className="object-cover" />
                        )}
                        <div className="absolute left-4 top-4 flex flex-col gap-2">
                          {!rifa.visible && (
                            <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                              Oculta
                            </span>
                          )}
                          {finalizada && (
                            <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                              Finalizada
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-4 p-5">
                        <header className="space-y-2">
                          <h3 className="text-lg font-bold text-slate-800 line-clamp-2">{rifa.nombre}</h3>
                          {rifa.descripcion && (
                            <p className="text-sm text-slate-500 line-clamp-3">{rifa.descripcion}</p>
                          )}
                        </header>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-xs font-semibold uppercase text-slate-500">Precio</p>
                            <p className="font-semibold text-slate-800">{formatCurrency(rifa.precio)}</p>
                          </div>
                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-xs font-semibold uppercase text-slate-500">Disponibles</p>
                            <p className="font-semibold text-slate-800">
                              {Math.max(rifa.total_numeros - rifa.numeros_vendidos, 0)}
                            </p>
                          </div>
                          <div className="rounded-xl bg-slate-50 p-3 col-span-2">
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span>Progreso</span>
                              <span>{progreso}%</span>
                            </div>
                            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="h-2 rounded-full bg-indigo-500 transition-all"
                                style={{ width: `${progreso}%` }}
                              />
                            </div>
                            <p className="mt-2 text-xs text-slate-500">
                              {rifa.numeros_vendidos} / {rifa.total_numeros} números vendidos
                            </p>
                          </div>
                          <div className="col-span-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
                            Termina el{' '}
                            <strong className="text-slate-700">
                              {format(new Date(rifa.fecha_fin), "dd 'de' MMMM, yyyy HH:mm", { locale: es })}
                            </strong>
                          </div>
                        </div>
                        <ComprarRifaDialog rifa={rifa} />
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  )
}

