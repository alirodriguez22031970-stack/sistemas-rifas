-- ============================================
-- RESETEAR USUARIO ADMINISTRADOR
-- ============================================
-- Este script resetea completamente el usuario admin
-- Úsalo si el rate limit está bloqueando el acceso
-- Ejecuta este script COMPLETO en Supabase SQL Editor

-- ============================================
-- PASO 1: Verificar estado actual
-- ============================================
SELECT 
  'Estado actual del usuario:' as info,
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at
FROM auth.users
WHERE email = 'admin@sistema-rifas.com';

-- ============================================
-- PASO 2: Confirmar email si no está confirmado
-- ============================================
UPDATE auth.users 
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  updated_at = NOW()
WHERE email = 'admin@sistema-rifas.com';

-- ============================================
-- PASO 3: Asegurar que existe en public.usuarios con rol admin
-- ============================================
DO $$
DECLARE
  user_id UUID;
BEGIN
  -- Obtener ID del usuario
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = 'admin@sistema-rifas.com'
  LIMIT 1;

  IF user_id IS NULL THEN
    RAISE NOTICE '❌ Usuario no encontrado. Crea el usuario primero en Authentication > Users';
    RETURN;
  END IF;

  -- Insertar o actualizar en public.usuarios
  INSERT INTO public.usuarios (id, email, nombre, rol)
  VALUES (user_id, 'admin@sistema-rifas.com', 'Administrador Principal', 'admin')
  ON CONFLICT (id) DO UPDATE
  SET 
    email = 'admin@sistema-rifas.com',
    nombre = 'Administrador Principal',
    rol = 'admin',
    updated_at = NOW();

  RAISE NOTICE '✅ Usuario configurado correctamente';
  RAISE NOTICE 'ID: %', user_id;
END $$;

-- ============================================
-- PASO 4: Verificación final
-- ============================================
SELECT 
  '✅ Usuario listo:' as estado,
  au.email,
  au.email_confirmed_at IS NOT NULL as email_confirmado,
  pu.rol,
  pu.nombre
FROM auth.users au
INNER JOIN public.usuarios pu ON au.id = pu.id
WHERE au.email = 'admin@sistema-rifas.com';

-- ============================================
-- IMPORTANTE: RESETEAR CONTRASEÑA
-- ============================================
-- Después de ejecutar este script:
-- 1. Ve a Supabase Dashboard > Authentication > Users
-- 2. Busca: admin@sistema-rifas.com
-- 3. Haz clic en los tres puntos (⋯) > "Reset password"
-- 4. O cambia la contraseña manualmente a: Admin123!@#
-- 5. Espera 5 minutos antes de intentar hacer login de nuevo

