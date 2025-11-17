-- ============================================
-- DIAGNÓSTICO COMPLETO DEL USUARIO ADMINISTRADOR
-- ============================================
-- Este script verifica TODOS los aspectos del usuario admin
-- Ejecuta este script COMPLETO en Supabase SQL Editor

-- ============================================
-- 1. VERIFICAR USUARIO EN auth.users
-- ============================================
SELECT 
  '=== USUARIO EN auth.users ===' as seccion,
  id,
  email,
  email_confirmed_at,
  encrypted_password IS NOT NULL as tiene_password,
  created_at,
  updated_at,
  last_sign_in_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN '❌ EMAIL NO CONFIRMADO'
    ELSE '✅ Email confirmado'
  END as estado_email
FROM auth.users
WHERE email = 'admin@sistema-rifas.com';

-- ============================================
-- 2. VERIFICAR USUARIO EN public.usuarios
-- ============================================
SELECT 
  '=== USUARIO EN public.usuarios ===' as seccion,
  id,
  email,
  nombre,
  rol,
  created_at,
  updated_at,
  CASE 
    WHEN rol = 'admin' THEN '✅ Rol correcto'
    ELSE '❌ ROL INCORRECTO: ' || rol
  END as estado_rol
FROM public.usuarios
WHERE email = 'admin@sistema-rifas.com';

-- ============================================
-- 3. VERIFICAR QUE LOS IDs COINCIDAN
-- ============================================
SELECT 
  '=== VERIFICACIÓN DE IDs ===' as seccion,
  au.id as auth_id,
  pu.id as public_id,
  CASE 
    WHEN au.id = pu.id THEN '✅ IDs coinciden'
    ELSE '❌ IDs NO COINCIDEN'
  END as estado_ids
FROM auth.users au
FULL OUTER JOIN public.usuarios pu ON au.id = pu.id
WHERE au.email = 'admin@sistema-rifas.com' OR pu.email = 'admin@sistema-rifas.com';

-- ============================================
-- 4. CORREGIR USUARIO (EJECUTA ESTO SI HAY PROBLEMAS)
-- ============================================
DO $$
DECLARE
  user_id UUID;
  email_confirmado BOOLEAN;
BEGIN
  -- Obtener ID del usuario
  SELECT id, email_confirmed_at IS NOT NULL
  INTO user_id, email_confirmado
  FROM auth.users
  WHERE email = 'admin@sistema-rifas.com'
  LIMIT 1;

  IF user_id IS NULL THEN
    RAISE NOTICE '❌ Usuario NO encontrado en auth.users';
    RAISE NOTICE 'Crea el usuario primero en Authentication > Users';
    RETURN;
  END IF;

  RAISE NOTICE '✅ Usuario encontrado con ID: %', user_id;

  -- Confirmar email si no está confirmado
  IF NOT email_confirmado THEN
    UPDATE auth.users 
    SET email_confirmed_at = NOW()
    WHERE id = user_id;
    RAISE NOTICE '✅ Email confirmado automáticamente';
  END IF;

  -- Asegurar que existe en public.usuarios con rol admin
  INSERT INTO public.usuarios (id, email, nombre, rol)
  VALUES (user_id, 'admin@sistema-rifas.com', 'Administrador Principal', 'admin')
  ON CONFLICT (id) DO UPDATE
  SET 
    email = 'admin@sistema-rifas.com',
    nombre = 'Administrador Principal',
    rol = 'admin';

  RAISE NOTICE '✅ Usuario configurado correctamente en public.usuarios';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Usuario administrador listo para usar!';
  RAISE NOTICE 'Email: admin@sistema-rifas.com';
  RAISE NOTICE 'Contraseña: Admin123!@#';
END $$;

-- ============================================
-- 5. VERIFICACIÓN FINAL
-- ============================================
SELECT 
  '=== VERIFICACIÓN FINAL ===' as seccion,
  au.email,
  au.email_confirmed_at IS NOT NULL as email_confirmado,
  pu.rol,
  CASE 
    WHEN au.email_confirmed_at IS NOT NULL AND pu.rol = 'admin' THEN '✅ TODO CORRECTO'
    WHEN au.email_confirmed_at IS NULL THEN '❌ Email no confirmado'
    WHEN pu.rol != 'admin' THEN '❌ Rol incorrecto: ' || pu.rol
    ELSE '⚠️ Revisar configuración'
  END as estado_final
FROM auth.users au
INNER JOIN public.usuarios pu ON au.id = pu.id
WHERE au.email = 'admin@sistema-rifas.com';

-- ============================================
-- 6. RESETEAR CONTRASEÑA (SI ES NECESARIO)
-- ============================================
-- Si la contraseña no funciona, ejecuta esto:
-- UPDATE auth.users 
-- SET encrypted_password = crypt('Admin123!@#', gen_salt('bf'))
-- WHERE email = 'admin@sistema-rifas.com';
-- 
-- NOTA: Esto puede no funcionar. Mejor resetea la contraseña desde:
-- Supabase Dashboard > Authentication > Users > [Usuario] > Reset Password

