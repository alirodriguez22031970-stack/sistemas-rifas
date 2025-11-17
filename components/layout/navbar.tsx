'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function Navbar() {
  const supabase = createClientComponentClient()
  const [session, setSession] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-lg sm:text-xl font-bold text-primary">
            Sistema de Rifas
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                Inicio
              </Button>
            </Link>
            {session ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <form action="/api/auth/logout" method="post">
                  <Button type="submit" variant="ghost" size="sm">
                    Salir
                  </Button>
                </form>
              </>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t py-4 space-y-2">
            <Link href="/" className="block">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                Inicio
              </Button>
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" className="block">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Dashboard
                  </Button>
                </Link>
                <form action="/api/auth/logout" method="post" className="block">
                  <Button type="submit" variant="ghost" size="sm" className="w-full justify-start">
                    Salir
                  </Button>
                </form>
              </>
            ) : (
              <Link href="/login" className="block">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

