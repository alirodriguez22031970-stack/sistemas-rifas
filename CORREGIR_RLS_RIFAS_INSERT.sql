-- ============================================
-- CORREGIR POLÍTICA RLS PARA INSERTAR RIFAS
-- ============================================
-- Este script corrige el error "new row violates row-level security policy"
-- al crear rifas con imágenes

-- Paso 1: Eliminar la política existente
DROP POLICY IF EXISTS "Solo admins pueden modificar rifas" ON public.rifas;

-- Paso 2: Crear política correcta con USING y WITH CHECK
-- USING se usa para SELECT, UPDATE, DELETE
-- WITH CHECK se usa para INSERT, UPDATE
CREATE POLICY "Solo admins pueden modificar rifas"
  ON public.rifas FOR ALL
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

-- Paso 3: Verificar que la política se creó correctamente
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'rifas';

-- Deberías ver la política con both 'qual' (USING) y 'with_check' (WITH CHECK) definidos
