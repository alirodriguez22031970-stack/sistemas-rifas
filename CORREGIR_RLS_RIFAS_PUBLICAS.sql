-- ============================================
-- CORREGIR RLS PARA RIFAS PÚBLICAS
-- ============================================
-- Este script asegura que usuarios anónimos puedan ver rifas visibles
-- Ejecuta este script COMPLETO en Supabase SQL Editor

-- Paso 1: Asegurar que RLS está habilitado
ALTER TABLE public.rifas ENABLE ROW LEVEL SECURITY;

-- Paso 2: Eliminar TODAS las políticas existentes de rifas que puedan estar bloqueando
DROP POLICY IF EXISTS "Rifas visibles para todos" ON public.rifas;
DROP POLICY IF EXISTS "Todos pueden ver rifas visibles" ON public.rifas;
DROP POLICY IF EXISTS "Solo admins pueden modificar rifas" ON public.rifas;
DROP POLICY IF EXISTS "Solo admins pueden insertar rifas" ON public.rifas;
DROP POLICY IF EXISTS "Solo admins pueden actualizar rifas" ON public.rifas;
DROP POLICY IF EXISTS "Solo admins pueden eliminar rifas" ON public.rifas;

-- Paso 3: Crear política SIMPLE que permita ver rifas visibles a TODOS (incluyendo anónimos)
-- Esta política NO requiere autenticación
CREATE POLICY "Rifas visibles para todos"
  ON public.rifas FOR SELECT
  USING (visible = true);

-- Paso 4: Crear políticas para que solo admins puedan modificar rifas
-- NOTA: Estas políticas requieren que exista una función is_admin() o verificación directa
-- Si tienes problemas, puedes comentar estas líneas temporalmente

-- Política para INSERT (solo admins)
CREATE POLICY "Solo admins pueden insertar rifas"
  ON public.rifas FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Política para UPDATE (solo admins)
CREATE POLICY "Solo admins pueden actualizar rifas"
  ON public.rifas FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Política para DELETE (solo admins)
CREATE POLICY "Solo admins pueden eliminar rifas"
  ON public.rifas FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Paso 5: Verificar que las políticas se crearon correctamente
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'rifas'
ORDER BY cmd, policyname;

-- Paso 6: Verificar que RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_habilitado
FROM pg_tables
WHERE tablename = 'rifas';

-- Paso 7: Probar la consulta (debería funcionar incluso sin autenticación)
-- Descomenta la siguiente línea para probar:
-- SELECT COUNT(*) FROM public.rifas WHERE visible = true;

