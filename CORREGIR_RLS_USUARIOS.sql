-- ============================================
-- SCRIPT DE CORRECCIÓN: Política RLS para INSERT en usuarios
-- ============================================
-- Ejecuta este script COMPLETO en Supabase SQL Editor
-- Esto solucionará el error: "new row violates row-level security policy"

-- Paso 1: Eliminar la política si ya existe (para evitar conflictos)
DROP POLICY IF EXISTS "Usuarios pueden insertar su propio registro" ON public.usuarios;

-- Paso 2: Crear la política que permite a los usuarios insertar su propio registro
CREATE POLICY "Usuarios pueden insertar su propio registro"
  ON public.usuarios FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Paso 3: Verificar que la política se creó correctamente
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'usuarios'
ORDER BY policyname;

-- Si ves la política "Usuarios pueden insertar su propio registro" en los resultados,
-- entonces está correctamente configurada.

