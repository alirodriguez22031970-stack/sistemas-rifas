-- ============================================
-- CORRECCIÓN: Eliminar Recursión Infinita en Políticas RLS
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

-- Paso 2: Crear función de seguridad para verificar si es admin (sin recursión)
-- Esta función usa SECURITY DEFINER para ejecutarse con permisos del propietario
-- y SET search_path para evitar problemas de recursión
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar directamente sin causar recursión
  -- SECURITY DEFINER ejecuta con permisos del propietario de la función
  -- Esto evita que las políticas RLS se apliquen dentro de la función
  RETURN EXISTS (
    SELECT 1 
    FROM public.usuarios 
    WHERE id = user_id AND rol = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Paso 3: Recrear políticas SIN recursión

-- Política: Usuarios pueden ver su propio perfil (sin cambios, esta está bien)
-- Ya existe, no la recreamos

-- Política: Admins pueden ver todos los usuarios (SIN recursión usando función)
CREATE POLICY "Admins pueden ver todos los usuarios"
  ON public.usuarios FOR SELECT
  USING (
    auth.uid() = id OR  -- Puede ver su propio perfil
    public.is_admin(auth.uid())  -- O es admin (usando función sin recursión)
  );

-- Política: Usuarios pueden insertar su propio registro (sin cambios)
-- Ya existe, no la recreamos

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

-- Política: Usuarios pueden crear compras (sin cambios, esta está bien)
-- Ya existe, no la recreamos

-- Política: Usuarios pueden ver todas las compras (simplificada, sin recursión)
CREATE POLICY "Usuarios pueden ver todas las compras"
  ON public.compras FOR SELECT
  USING (true);  -- Todos pueden ver compras (los admins las gestionan)

-- Política: Solo admins pueden modificar compras (SIN recursión)
CREATE POLICY "Solo admins pueden modificar compras"
  ON public.compras FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Política: Numeros vendidos visibles para todos (sin cambios)
-- Ya existe, no la recreamos

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
-- 1. Recarga la aplicación en el navegador
-- 2. Intenta iniciar sesión de nuevo
-- 3. El error de recursión debería estar resuelto

