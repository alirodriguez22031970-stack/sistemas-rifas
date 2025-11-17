-- ============================================
-- CORRECCIÓN: Error "SET is not allowed in a non-volatile function"
-- ============================================
-- Este script corrige el error al cambiar la función is_admin de STABLE a VOLATILE
-- Ejecuta este script COMPLETO en Supabase SQL Editor

-- IMPORTANTE: Usamos CREATE OR REPLACE directamente sin DROP
-- porque las políticas RLS dependen de esta función

-- Recrear la función como VOLATILE (permite SET LOCAL)
-- CREATE OR REPLACE mantiene las dependencias (políticas RLS)
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
$$ LANGUAGE plpgsql SECURITY DEFINER VOLATILE;

-- Paso 3: Verificar que la función se creó correctamente
SELECT 
  proname,
  provolatile,
  prosecdef
FROM pg_proc
WHERE proname = 'is_admin';

-- Deberías ver:
-- proname: is_admin
-- provolatile: v (volatile)
-- prosecdef: t (security definer)

