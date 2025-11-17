-- ============================================
-- VERIFICAR RIFAS EN LA BASE DE DATOS
-- ============================================
-- Ejecuta este script en Supabase SQL Editor para verificar si hay rifas

-- Ver todas las rifas
SELECT 
  id,
  nombre,
  activa,
  visible,
  numeros_vendidos,
  total_numeros,
  created_at
FROM public.rifas
ORDER BY created_at DESC;

-- Contar rifas activas y visibles
SELECT 
  COUNT(*) as total_rifas,
  COUNT(*) FILTER (WHERE activa = true) as rifas_activas,
  COUNT(*) FILTER (WHERE visible = true) as rifas_visibles,
  COUNT(*) FILTER (WHERE activa = true AND visible = true) as rifas_activas_y_visibles
FROM public.rifas;

-- Verificar políticas RLS en la tabla rifas
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

-- Verificar si RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_habilitado
FROM pg_tables
WHERE tablename = 'rifas';

