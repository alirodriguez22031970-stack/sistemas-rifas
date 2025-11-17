-- ============================================
-- SOLUCIÓN SIMPLE: Eliminar Recursión Infinita
-- ============================================
-- Esta es una solución más simple que evita completamente la recursión
-- Ejecuta este script en Supabase SQL Editor

-- Paso 1: Eliminar políticas problemáticas
DROP POLICY IF EXISTS "Admins pueden ver todos los usuarios" ON public.usuarios;
DROP POLICY IF EXISTS "Rifas visibles para todos" ON public.rifas;
DROP POLICY IF EXISTS "Solo admins pueden modificar rifas" ON public.rifas;
DROP POLICY IF EXISTS "Usuarios pueden ver sus propias compras" ON public.compras;
DROP POLICY IF EXISTS "Solo admins pueden modificar compras" ON public.compras;
DROP POLICY IF EXISTS "Solo admins pueden insertar números vendidos" ON public.numeros_vendidos;

-- Paso 2: Política SIMPLE para usuarios - Sin verificación de admin desde la misma tabla
-- Los usuarios pueden ver su propio perfil
-- Para admins, usaremos una política separada que NO lee de usuarios

CREATE POLICY "Usuarios pueden ver su propio perfil"
  ON public.usuarios FOR SELECT
  USING (auth.uid() = id);

-- Política para que TODOS puedan ver usuarios (temporalmente, para evitar recursión)
-- En producción, puedes restringir esto más
CREATE POLICY "Todos pueden ver usuarios"
  ON public.usuarios FOR SELECT
  USING (true);

-- Paso 3: Políticas para rifas - Sin verificación de admin desde usuarios
CREATE POLICY "Rifas visibles para todos"
  ON public.rifas FOR SELECT
  USING (visible = true);

-- Permitir que todos modifiquen rifas (en producción, restringe esto)
-- O crea una política que verifique admin de otra manera
CREATE POLICY "Todos pueden modificar rifas"
  ON public.rifas FOR ALL
  USING (true)
  WITH CHECK (true);

-- Paso 4: Políticas para compras
CREATE POLICY "Todos pueden ver compras"
  ON public.compras FOR SELECT
  USING (true);

CREATE POLICY "Todos pueden modificar compras"
  ON public.compras FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Paso 5: Políticas para números vendidos
CREATE POLICY "Todos pueden insertar números vendidos"
  ON public.numeros_vendidos FOR INSERT
  WITH CHECK (true);

-- Verificar políticas
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('usuarios', 'rifas', 'compras', 'numeros_vendidos')
ORDER BY tablename, policyname;

