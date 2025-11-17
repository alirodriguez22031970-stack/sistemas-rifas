-- Script para corregir las políticas RLS de la tabla usuarios
-- Ejecuta esto en Supabase SQL Editor si ya ejecutaste el schema principal

-- Eliminar políticas existentes de INSERT si existen (opcional, no causará error si no existen)
DROP POLICY IF EXISTS "Usuarios pueden insertar su propio registro" ON public.usuarios;

-- Crear política que permite a los usuarios insertar su propio registro
CREATE POLICY "Usuarios pueden insertar su propio registro"
  ON public.usuarios FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Verificar que la política se creó correctamente
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

