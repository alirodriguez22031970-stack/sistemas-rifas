-- ============================================
-- SOLUCIÓN DEFINITIVA: Corregir RLS para INSERT en `rifas`
-- ============================================
-- Este script corrige el error "new row violates row-level security policy"
-- al crear rifas con imágenes.
-- 
-- IMPORTANTE: Ejecuta este script COMPLETO en Supabase SQL Editor

-- Paso 1: Eliminar TODAS las políticas existentes de rifas
DROP POLICY IF EXISTS "Solo admins pueden modificar rifas" ON public.rifas;
DROP POLICY IF EXISTS "Rifas visibles para todos" ON public.rifas;

-- Paso 2: Recrear política para SELECT (visible para todos o admin)
CREATE POLICY "Rifas visibles para todos"
  ON public.rifas FOR SELECT
  USING (
    visible = true OR
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Paso 3: Crear política para INSERT (SOLO para admins)
-- IMPORTANTE: Debe tener WITH CHECK para INSERT
CREATE POLICY "Solo admins pueden insertar rifas"
  ON public.rifas FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Paso 4: Crear política para UPDATE (SOLO para admins)
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

-- Paso 5: Crear política para DELETE (SOLO para admins)
CREATE POLICY "Solo admins pueden eliminar rifas"
  ON public.rifas FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.usuarios
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Paso 6: Verificar que las políticas se crearon correctamente
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'rifas'
ORDER BY policyname;

-- Deberías ver 4 políticas:
-- 1. "Rifas visibles para todos" (cmd: SELECT)
-- 2. "Solo admins pueden insertar rifas" (cmd: INSERT, with_check: definido)
-- 3. "Solo admins pueden actualizar rifas" (cmd: UPDATE, qual y with_check: definidos)
-- 4. "Solo admins pueden eliminar rifas" (cmd: DELETE, qual: definido)

