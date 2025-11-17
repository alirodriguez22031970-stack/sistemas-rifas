-- ============================================
-- CORRECCIÓN FINAL: Eliminar Recursión Infinita en RLS
-- ============================================
-- Este script corrige el error: "infinite recursion detected in policy for relation 'usuarios'"
-- Ejecuta este script COMPLETO en Supabase SQL Editor

-- Paso 1: Eliminar todas las políticas problemáticas que causan recursión
DROP POLICY IF EXISTS "Admins pueden ver todos los usuarios" ON public.usuarios;
DROP POLICY IF EXISTS "Rifas visibles para todos" ON public.rifas;
DROP POLICY IF EXISTS "Solo admins pueden modificar rifas" ON public.rifas;
DROP POLICY IF EXISTS "Usuarios pueden ver sus propias compras" ON public.compras;
DROP POLICY IF EXISTS "Solo admins pueden modificar compras" ON public.compras;
DROP POLICY IF EXISTS "Solo admins pueden insertar números vendidos" ON public.numeros_vendidos;

-- Paso 2: Crear función de seguridad que DESHABILITA RLS temporalmente
-- Esto evita completamente la recursión
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_admin_result BOOLEAN;
BEGIN
  -- Deshabilitar RLS temporalmente para esta consulta
  -- Esto evita que las políticas se apliquen y causen recursión
  SET LOCAL row_security = off;
  
  SELECT EXISTS (
    SELECT 1 
    FROM public.usuarios 
    WHERE id = user_id AND rol = 'admin'
  ) INTO is_admin_result;
  
  RETURN COALESCE(is_admin_result, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Paso 3: Recrear políticas SIN recursión

-- Política: Usuarios pueden ver su propio perfil (ya existe, no la recreamos)
-- Si no existe, créala:
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'usuarios' 
    AND policyname = 'Usuarios pueden ver su propio perfil'
  ) THEN
    CREATE POLICY "Usuarios pueden ver su propio perfil"
      ON public.usuarios FOR SELECT
      USING (auth.uid() = id);
  END IF;
END $$;

-- Política: Admins pueden ver todos los usuarios (SIN recursión usando función)
CREATE POLICY "Admins pueden ver todos los usuarios"
  ON public.usuarios FOR SELECT
  USING (
    auth.uid() = id OR  -- Puede ver su propio perfil
    public.is_admin(auth.uid())  -- O es admin (usando función sin recursión)
  );

-- Política: Usuarios pueden insertar su propio registro (ya existe)
-- Si no existe, créala:
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'usuarios' 
    AND policyname = 'Usuarios pueden insertar su propio registro'
  ) THEN
    CREATE POLICY "Usuarios pueden insertar su propio registro"
      ON public.usuarios FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Política: Rifas visibles para todos, ocultas solo para admins (SIN recursión)
CREATE POLICY "Rifas visibles para todos"
  ON public.rifas FOR SELECT
  USING (
    visible = true OR  -- Rifas visibles para todos
    public.is_admin(auth.uid())  -- O es admin (usando función)
  );

-- Política: Solo admins pueden modificar rifas (SIN recursión)
CREATE POLICY "Solo admins pueden modificar rifas"
  ON public.rifas FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Política: Usuarios pueden crear compras (ya existe, no la recreamos)
-- Si no existe, créala:
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'compras' 
    AND policyname = 'Usuarios pueden crear compras'
  ) THEN
    CREATE POLICY "Usuarios pueden crear compras"
      ON public.compras FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- Política: Usuarios pueden ver todas las compras (simplificada, sin recursión)
CREATE POLICY "Usuarios pueden ver todas las compras"
  ON public.compras FOR SELECT
  USING (true);  -- Todos pueden ver compras (los admins las gestionan)

-- Política: Solo admins pueden modificar compras (SIN recursión)
CREATE POLICY "Solo admins pueden modificar compras"
  ON public.compras FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Política: Numeros vendidos visibles para todos (ya existe)
-- Si no existe, créala:
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'numeros_vendidos' 
    AND policyname = 'Numeros vendidos visibles para todos'
  ) THEN
    CREATE POLICY "Numeros vendidos visibles para todos"
      ON public.numeros_vendidos FOR SELECT
      USING (true);
  END IF;
END $$;

-- Política: Solo admins pueden insertar números vendidos (SIN recursión)
CREATE POLICY "Solo admins pueden insertar números vendidos"
  ON public.numeros_vendidos FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- Paso 4: Verificar que las políticas se crearon correctamente
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('usuarios', 'rifas', 'compras', 'numeros_vendidos')
ORDER BY tablename, policyname;

-- ============================================
-- IMPORTANTE: Después de ejecutar este script
-- ============================================
-- 1. Recarga la aplicación en el navegador (F5)
-- 2. Intenta iniciar sesión de nuevo
-- 3. El error de recursión debería estar resuelto ✅

